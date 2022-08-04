import { Permit } from "testhahathisisnotarealpackage";

const permit = new Permit({
  token: process.env.PERMIT_API_KEY,
  pdp: process.env.PERMIT_PDP_URL,
  debugMode:
    process.env.PERMIT_DEBUG && process.env.PERMIT_DEBUG.toLowerCase() == "true"
      ? true
      : false,
});

(async function() {
	await permit.api.createResource(
		{
		  key: "task",
		  actions: {
			list: {},
			retrieve: {},
			create: {},
			update: {},
			delete: {},
		  },
		},
	);
	await permit.api.createResource(
		{
		  key: "board",
		  actions: {
			list: {},
			create: {},
			update: {},
			delete: {},
		  },
		},
	);
})();

export default permit;
