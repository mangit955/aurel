import "dotenv/config";
import IORedis from "ioredis";
import { Worker, Job } from "bullmq";
import { prisma } from "@aurel/db";
import { emailExecutor } from "./executors/email";
import { executeWorkflow } from "./engine/executor";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

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

const worker = new Worker(
  "workflow-execution",
  async (job: Job) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);

    try {
      if (job.name === "send-email-test") {
        const { to, subject, body, from } = job.data;
        console.log(`Sending email to ${to} with subject "${subject}"...`);
        const result = await emailExecutor(
          { data: { to, subject, body, from } },
          {},
        );
        console.log("Email result:", result);
      } else if (job.name === "run-workflow") {
        const { executionId, workflowId, triggerData } = job.data;

        console.log(
          `Running full workflow ${workflowId} for execution ${executionId}...`,
        );

        await executeWorkflow(executionId, workflowId, triggerData);

        console.log(`✔️ Workflow ${workflowId} executed successfully`);
      } else {
        console.log(`Ignoring unknown job type: ${job.name}`);
      }
    } catch (err) {
      console.error(`❌ Job ${job.id} failed:`, err);
      throw err; // let BullMQ mark it as failed
    }
  },
  {
    connection,
    concurrency: 5,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed.`);
});

worker.on("failed", async (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err);

  if (job?.name !== "run-workflow") {
    return;
  }

  const executionId = (job.data as { executionId?: string } | undefined)
    ?.executionId;
  if (!executionId) {
    return;
  }

  try {
    await prisma.execution.updateMany({
      where: {
        id: executionId,
        status: { in: ["queued", "running"] },
      },
      data: {
        status: "failed",
        endedAt: new Date(),
      },
    });
  } catch (updateError) {
    console.error(
      `Failed to mark execution ${executionId} as failed after job failure:`,
      updateError,
    );
  }
});

console.log("Worker running...");
