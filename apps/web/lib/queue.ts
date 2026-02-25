// apps/web/lib/queue.ts

import { Queue } from "bullmq";
import IORedis from "ioredis";

// Create a Redis connection (BullMQ uses ioredis under the hood)
const connection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

// Create a queue instance
export const workflowQueue = new Queue("workflow-execution", {
  connection,
});
