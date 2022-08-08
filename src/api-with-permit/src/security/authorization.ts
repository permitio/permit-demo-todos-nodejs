import { Permit } from "mysdkfornodetempv2";

const permit = new Permit({
  token: process.env.PERMIT_API_KEY,
  pdp: process.env.PERMIT_PDP_URL,
});

(async function () {
  try {
    await permit.api.createResource({
      key: "task",
      name: "Task",
      actions: {
        list: { name: "List" },
        retrieve: { name: "Retrieve" },
        create: { name: "Create" },
        update: { name: "Update" },
        delete: { name: "Delete" },
      },
    });
  } catch (e) {
    if (e.response.status != 409) {
      throw e;
    }
  }
  try {
    await permit.api.createResource({
      key: "board",
      name: "Board",
      actions: {
        list: { name: "List" },
        create: { name: "Create" },
        update: { name: "Update" },
        delete: { name: "Delete" },
      },
    });
  } catch (e) {
    if (e.response.status != 409) {
      throw e;
    }
  }
  try {
    await permit.api.createRole({
      key: "admin",
      name: "admin",
      permissions: [
        "task:list",
        "task:retrieve",
        "task:create",
        "task:update",
        "task:delete",
        "board:list",
        "board:create",
        "board:update",
        "board:delete",
      ],
    });
  } catch (e) {
    if (e.response.status != 409) {
      throw e;
    }
  }
})();

export default permit;
