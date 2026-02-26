import "dotenv/config";
import IORedis from "ioredis";
import { Worker, Queue, Job } from "bullmq";
import { emailExecutor } from "./executors/email";
import { executeWorkflow } from "./engine/executor";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "workflow-execution",
  async (job: Job) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    
    if (job.name === "send-email-test") {
      const { to, subject, body, from } = job.data;
      console.log(`Sending email to ${to} with subject "${subject}"...`);
      const result = await emailExecutor(
        { data: { to, subject, body, from } },
        {},
      );
      console.log(`Email result:`, result);
    } else if (job.name === "run-workflow") {
      console.log(`Running full workflow ${job.data.workflowId} for execution ${job.data.executionId}...`);
      await executeWorkflow(
        job.data.executionId,
        job.data.workflowId,
        job.data.triggerData
      );
      console.log(`Finished executing workflow ${job.data.workflowId}! logs saved gracefully.`);
    } else {
      console.log(`Ignoring unknown job type: ${job.name}`);
    }
  },
  {
    connection,
  },
);

console.log("Worker running...");
