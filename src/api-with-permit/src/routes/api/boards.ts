import express from "express";
import { BoardService, IBoardCreate, IBoardUpdate } from "../../services";
import { Board } from "../../models";
import tasks from "./tasks";
import permit from "../../security/authorization";

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
  // permissions check

  // NOTE: special case! with RBAC, all objects must live inside
  // a tenant, and since each board is also a tenant, we don't know
  // the tenant id when listing or creating boards/tenants.

  // what we can do, is to filter only on the tenants we own.
  const tenants = ["default"];
  // the tenant ids are also the board ids so we
  // can filter all the boards with matching ids
  BoardService.getAllByIds(tenants)
    .then((boards) => {
      return res.json(boards.map((b) => b.toJSON()));
    })
    .catch(next);
});

router.post("", async function (req, res, next) {
  // permissions check

  // "validation"
  if (!req.body.title) {
    return res.status(422).json({ errors: { title: "can't be blank" } });
  }

  const boardData: IBoardCreate = {
    title: req.body.title,
  };

  try {
    const board = await BoardService.create(boardData);

    // by creating a new board we are mutating state that affect permissions
    // the board must be put inside a tenant and the acting user must be assigned
    // with a role on the new tenant.
    const tenantKey = board.id;
    // create a tenant that will contain the new board
    const tenant = await permit.api.createTenant({ key: tenantKey, name: boardData.title });
    // assign an admin role to the current user on the new tenant
    const role = await permit.api.assignRole({user: req.activeUser?.id, role: "admin", tenant: tenantKey});

    // this is not mandatory - it's just for bookeeping
    await BoardService.update(board.id, { tenantId: tenant.id });
    // we set the timeout to give the local cache a chance to refresh
    setTimeout(() => {
      // return the board
      return res.json(board.toJSON());
    }, 200);
  } catch (error) {
    next(error);
  }
});

router.put("/:boardId", async function (req, res, next) {
  const boardId = req.params.boardId;

  // permissions check
  const permitted = await permit.check(req.activeUser?.id, "update", {
    type: "board",
    tenant: boardId,
  });
  if (!permitted) {
    res.status(403).send("Forbidden: not allowed by policy!");
    return;
  }

  // TODO: once we have relations, we can simply run:
  // const permitted = await permit.check(req.activeUser?.id, "update", `board:${boardId}`);

  const update: IBoardUpdate = {};
  if (req.body.title) {
    update.title = req.body.title;
  }

  BoardService.update(boardId, update)
    .then((board) => {
      if (board === null) {
        return res.status(404).send("board not found!");
      } else {
        permit
          .api.updateTenant(board.id, { name: update.title })
          .then(() => {
            return res.json(board.toJSON());
          });
      }
    })
    .catch(next);
});

router.delete("/:boardId", async function (req, res, next) {
  // is allowed check
  // const allowed = await isAllowed(req, "delete", "tenant");
  // if (!allowed) {
  //   res.status(403).send("Forbidden: not allowed by policy!");
  //   return;
  // }

  const boardId = req.params.boardId;

  // permissions check
  const permitted = await permit.check(req.activeUser?.id, "delete", {
    type: "board",
    tenant: boardId,
  });
  if (!permitted) {
    res.status(403).send("Forbidden: not allowed by policy!");
    return;
  }

  BoardService.remove(boardId)
    .then(() => {
      permit.api.deleteTenant(boardId).then(() => {
        return res.sendStatus(204);
      });
    })
    .catch(next);
});

router.use("/:boardId/tasks", tasks);

export default router;
