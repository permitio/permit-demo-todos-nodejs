import express from "express";

interface HttpError extends Error {
  status?: number;
}

export default async function addErrorHandlers(app: express.Application) {
  const isProduction = process.env.NODE_ENV === "production";

  // catch 404 and forward to error handler
  app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
    const err: HttpError = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  // development error handler (will print stacktrace)
  if (!isProduction) {
    app.use(function(err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) {
      console.log(err.stack);
  
      res.status(err.status || 500);
  
      res.json({"errors": {
        message: err.message,
        error: err
      }});
    });
  }
  
  // production error handler (no stacktraces leaked to user)
  app.use(function(err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.json({"errors": {
      message: err.message,
      error: {}
    }});
  });
}