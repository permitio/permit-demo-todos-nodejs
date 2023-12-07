import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import errorhandler from "errorhandler";

import { AddressInfo } from "net";
import morgan from "morgan";
import methodOverride from "method-override";
import apiRouter from "./routes/api";

require("./security/authorization"); // inits the permit SDK and syncs the resources
import requireAuthentication from "./security/authentication";
// import permit from "./security/authorization";
import addErrorHandlers from "./errors";
import setupHealthcheck from "./routes/healthcheck";

const isProduction = process.env.NODE_ENV === "production";

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(express.static(__dirname + "/public"));

if (!isProduction) {
  app.use(errorhandler());
}

// setup mongo db
require("./models");

// these routes require no authentication/authorization
setupHealthcheck(app);

// apply authentication and authorization middlewares across all api routes
requireAuthentication(app);

app.use("/api/v1", apiRouter);

// add error handler middleware
addErrorHandlers(app);

// finally, let's start our server...
const server = app.listen(process.env.PORT || 8008, function () {
  console.log("Listening on port " + (server.address() as AddressInfo).port);
});
