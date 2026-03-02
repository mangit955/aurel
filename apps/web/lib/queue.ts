// apps/web/lib/queue.ts

import { Queue } from "bullmq";
import IORedis from "ioredis";

// Create a Redis connection (BullMQ uses ioredis under the hood)
const redisUrl = process.env.REDIS_URL;
const connection = redisUrl
  ? new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
    })
  : new IORedis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
    });

// Create a queue instance
export const workflowQueue = new Queue("workflow-execution", {
  connection,
});
