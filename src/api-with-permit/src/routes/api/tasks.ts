import express from "express";
import { TaskService, ITaskCreate, ITaskUpdate } from "../../services";
import permit from "../../security/authorization";

const router = express.Router({ mergeParams: true });

router.get(
  "",
  // permit.decorate<express.RequestHandler>(
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // permissions check
    const permitted = await permit.check("demo-" + req.activeUser?.id, "list", {
      type: "task",
      tenant: "demo-" + req.params.boardId,
    });
    if (!permitted) {
      res.status(403).send("Forbidden: not allowed by policy!");
      return;
    }

    TaskService.getAllInBoard(req.board.id)
      .then((tasks) => {
        return res.json(tasks.map((t) => t.toJSON()));
      })
      .catch(next);
  }
  // ,
  // { resource: { name: "task" } }
  // )
);

router.get(
  "/:taskId",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // permissions check
    const permitted = await permit.check(
      "demo-" + req.activeUser?.id,
      "retrieve",
      {
        type: "task",
        tenant: "demo-" + req.params.boardId,
      }
    );
    if (!permitted) {
      res.status(403).send("Forbidden: not allowed by policy!");
      return;
    }
    // TODO: single tenant mode
    // const permitted = await permit.check("demo-"+req.activeUser?.id, "retrieve", "task");

    const taskId = req.params.taskId;
    TaskService.get(taskId, req.board.id)
      .then((task) => {
        if (!task) {
          return res.status(404).send("task not found!");
        }
        return res.json(task.toJSON());
      })
      .catch(next);
  }
);

router.post(
  "",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // permissions check
    const permitted = await permit.check(
      "demo-" + req.activeUser?.id,
      "create",
      {
        type: "task",
        tenant: "demo-" + req.params.boardId,
      }
    );
    if (!permitted) {
      res.status(403).send("Forbidden: not allowed by policy!");
      return;
    }

    // "validation"
    if (!req.body.title) {
      return res.status(422).json({ errors: { title: "can't be blank" } });
    }

    const taskData: ITaskCreate = {
      boardId: req.board.id,
      title: req.body.title,
    };
    TaskService.create(taskData)
      .then((task) => {
        return res.json(task.toJSON());
      })
      .catch(next);
  }
);

router.put(
  "/:taskId",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // permissions check
    const permitted = await permit.check(
      "demo-" + req.activeUser?.id,
      "update",
      {
        type: "task",
        tenant: "demo-" + req.params.boardId,
      }
    );
    if (!permitted) {
      res.status(403).send("Forbidden: not allowed by policy!");
      return;
    }

    const taskId = req.params.taskId;

    const update: ITaskUpdate = {};
    if (req.body.title) {
      update.title = req.body.title;
    }
    if (req.body.description) {
      update.description = req.body.description;
    }
    if (req.body.checked !== null && req.body.checked !== undefined) {
      update.checked = req.body.checked;
    }

    const task = await TaskService.update(taskId, update);
    if (task === null) {
      return res.status(404).send("task not found!");
    } else {
      return res.json(task.toJSON());
    }
  }
);

router.delete(
  "/:taskId",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // permissions check
    const permitted = await permit.check(
      "demo-" + req.activeUser?.id,
      "delete",
      {
        type: "task",
        tenant: "demo-" + req.params.boardId,
      }
    );
    if (!permitted) {
      res.status(403).send("Forbidden: not allowed by policy!");
      return;
    }

    const taskId = req.params.taskId;
    const task = await TaskService.get(taskId, req.board.id);

    if (!task) {
      return res.status(404).send("task not found!");
    }

    TaskService.remove(taskId)
      .then(() => {
        return res.sendStatus(204);
      })
      .catch(next);
  }
);

export default router;
