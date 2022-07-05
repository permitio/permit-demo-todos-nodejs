import { Permit } from "permitio";

const permit = new Permit({
  token: process.env.PERMIT_API_KEY,
  pdp: process.env.PERMIT_PDP_URL,
  debugMode:
    process.env.PERMIT_DEBUG && process.env.PERMIT_DEBUG.toLowerCase() == "true"
      ? true
      : false,
});

permit.syncResources({
  resources: [
    {
      type: "task",
      actions: {
        list: {},
        retrieve: {},
        create: {},
        update: {},
        delete: {},
      },
    },
    {
      type: "board",
      actions: {
        list: {},
        create: {},
        update: {},
        delete: {},
      },
    },
  ],
});

export default permit;
