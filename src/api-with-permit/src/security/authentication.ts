import express from "express";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import axios from "axios";

import config from "../config";
import { User } from "../models";
import { UserService } from "../services";

export interface ExpressJwtUser {
  sub: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: ExpressJwtUser;
    activeUser?: User;
  }
}

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.auth0.domain}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: config.auth0.audience,
  issuer: `https://${config.auth0.domain}/`,
  algorithms: config.auth0.algorithms,
});

const getTokenFromHeader = (req: express.Request) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
};

const getUserInfo = (token: string) => {
  return axios
    .get(`https://${config.auth0.domain}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export default async function requireAuthentication(app: express.Application) {
  // enforce valid JWT
  app.use(checkJwt);

  // either get the user from db or create it in db for the first time (onboard)
  app.use(function (req, res, next) {
    const userId: string = req.user.sub; // will not get here unless jwt is valid
    UserService.getByUserId(userId)
      .then((user) => {
        if (!user) {
          // new user, we need to onboard
          const token = getTokenFromHeader(req);
          getUserInfo(token)
            .then((userInfo) => {
              UserService.createFromIdentityProviderInfo(userId, userInfo)
                .then((user) => {
                  req.activeUser = user;
                  next();
                })
                .catch(next);
            })
            .catch(next);
        } else {
          req.activeUser = user;
          next();
        }
      })
      .catch(next);
  });

  app.use(function (req, res, next) {
    const user = req.activeUser;
    // make sure we have an active user
    if (!user) {
      return res.status(401).send("Unauthorized, no active user detected!");
    }

    if (
      user.permissionsUserId === null ||
      user.permissionsUserId === undefined
    ) {
      // user is not yet synced to the permissions system
      UserService.syncUserPermissions(user)
        .then(() => {
          // we sleep before continuing because there is a race condition
          // where the syncing of a new user triggered a policy update
          // but we might already query on it immediately.
          setTimeout(next, 500);
        })
        .catch(next);
    } else {
      // user is already synced, skip...
      next();
    }
  });
}
