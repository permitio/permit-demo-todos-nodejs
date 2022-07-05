import express from "express";
import { BoardService, IBoardCreate, IBoardUpdate } from "../../services";
import { Board } from "../../models";
import tasks from "./tasks";

const router = express.Router();

declare module "express-serve-static-core" {
  interface Request {
    board?: Board;
  }
}

router.param(
  "boardId",
  function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
    boardId: string
  ) {
    BoardService.getById(boardId)
      .then((board) => {
        if (!board) {
          return res.status(404).send("board not found!");
        }
        req.board = board;
        return next();
      })
      .catch(next);
  }
);

router.get("", async function (req, res, next) {
  const user = req.activeUser;
  BoardService.getAll()
    .then((boards) => {
      return res.json(boards.map((b) => b.toJSON()));
    })
    .catch(next);
});

router.post("", async function (req, res, next) {
  // "validation"
  if (!req.body.title) {
    return res.status(422).json({ errors: { title: "can't be blank" } });
  }

  const boardData: IBoardCreate = {
    title: req.body.title,
  };

  try {
    const board = await BoardService.create(boardData);
    return res.json(board.toJSON());
  } catch (error) {
    next(error);
  }
});

router.put("/:boardId", async function (req, res, next) {
  const boardId = req.params.boardId;

  const update: IBoardUpdate = {};
  if (req.body.title) {
    update.title = req.body.title;
  }

  BoardService.update(boardId, update)
    .then((board) => {
      if (board === null) {
        return res.status(404).send("board not found!");
      } else {
        return res.json(board.toJSON());
      }
    })
    .catch(next);
});

router.delete("/:boardId", async function (req, res, next) {
  const boardId = req.params.boardId;

  BoardService.remove(boardId)
    .then(() => {
      return res.sendStatus(204);
    })
    .catch(next);
});

router.use("/:boardId/tasks", tasks);

export default router;
