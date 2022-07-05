import express from "express";
import users from "./users";
import boards from "./boards";

const router = express.Router();
router.use("/users", users);
router.use("/boards", boards);

router.use(function (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (err.name === "ValidationError") {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function (
        errors: Record<string, any>,
        key: string
      ) {
        errors[key] = err.errors[key].message;
        return errors;
      },
      {}),
    });
  }

  return next(err);
});

export default router;
