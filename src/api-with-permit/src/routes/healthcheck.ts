import express from "express";

export default async function setupHealthcheck(app: express.Application) {
  // the healthcheck route has no authentication
  const healthcheck = function(req: express.Request, res: express.Response, next: express.NextFunction) {
    return res.json({
      status: "ok",
    });
  };

  app.get("/", healthcheck);
  app.get("/healthcheck", healthcheck);
}