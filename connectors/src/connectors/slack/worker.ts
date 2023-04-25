import { Worker } from "@temporalio/worker";

import logger from "../../logger/logger.js";
import * as activities from "./slack.js";

async function run(): Promise<void> {
  const worker = await Worker.create({
    workflowsPath: require.resolve("./workflow"),
    activities,
    taskQueue: "slack-sync",
  });
  await worker.run();

  return;
}

run().catch((err) => logger.info(err));