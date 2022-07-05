import rookout from "rookout";

export default function initRookout() {
  const rookout_token: string = process.env.ROOKOUT_TOKEN || undefined;
  if (!rookout_token) {
    console.log("No rookout token found, skipping.");
    return;
  }

  const service: string = process.env.ROOKOUT_SERVICE || "todo-backend-node";
  const env: string = process.env.ROOKOUT_ENV || "dev";
  const user: string = process.env.ROOKOUT_USER || "unknown";

  const labels: Map<string, string> = new Map([
    ["env", env],
    ["service", service],
    ["user", user],
  ]);

  console.log("Running Rookout...");
  rookout.start({
    token: rookout_token,
    labels: labels,
  });
}