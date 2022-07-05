import express from "express";
const router = express.Router();

router.get(
  "/me",
  function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (!req.activeUser) {
      return res.status(401).send("Unauthorized, no active user detected!");
    }
    return res.json(req.activeUser.toJSON());
  }
);

export default router;
