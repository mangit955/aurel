// apps/worker/engine/executor.ts

import { prisma } from "@aurel/db";
import { executeNode } from "../executors";

interface NodeLog {
  nodeId: string;
  nodeName: string;
  status: "success" | "failed" | "skipped";
  input: any;
  output?: any;
  error?: string;
  duration: number;
}

export async function executeWorkflow(
  executionId: string,
  workflowId: string,
  triggerData: any,
) {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow) throw new Error("Workflow not found");

  await prisma.execution.update({
    where: { id: executionId },
    data: {
      status: "running",
      // optional: clear logs if rerunning
      logs: [],
      endedAt: null,
    },
  });

  const nodes = workflow.nodes as any[];
  const edges = workflow.edges as any[];
  const logs: NodeLog[] = [];

  // ✅ Build nodeMap — O(1) lookup, not O(n²)
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // ✅ Build adjacency list — source -> [{ targetId, sourceHandle }]
  const adjacency = new Map<
    string,
    { targetId: string; sourceHandle?: string }[]
  >();
  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
    adjacency.get(edge.source)!.push({
      targetId: edge.target,
      sourceHandle: edge.sourceHandle,
    });
  });
  console.log(
    "All node types:",
    nodes.map((n) => n.type),
  );
  // Find start node
  const startNode = nodes.find((n) => n.type === "webhookTrigger");
  if (!startNode) throw new Error("No trigger node found");

  // BFS execution
  // Each queue item carries the output from its parent as input
  const queue: { nodeId: string; input: any; sourceHandle?: string }[] = [
    { nodeId: startNode.id, input: triggerData },
  ];

  while (queue.length > 0) {
    const { nodeId, input } = queue.shift()!;
    const node = nodeMap.get(nodeId);
    if (!node) continue;

    const start = Date.now();

    try {
      const output = await executeNode(node, input);
      const duration = Date.now() - start;

      logs.push({
        nodeId: node.id,
        nodeName: node.data?.label || node.type,
        status: "success",
        input,
        output,
        duration,
      });

      // Queue next nodes — pass this node's output as their input
      const nextNodes = adjacency.get(nodeId) || [];
      nextNodes.forEach(({ targetId, sourceHandle }) => {
        // For IF node: only follow the branch matching the output
        if (node.type === "ifNode") {
          if (sourceHandle === output.data.branch) {
            queue.push({ nodeId: targetId, input: output.data });
          }
        } else {
          queue.push({ nodeId: targetId, input: output });
        }
      });
    } catch (err: any) {
      logs.push({
        nodeId: node.id,
        nodeName: node.data?.label || node.type,
        status: "failed",
        input,
        error: err.message,
        duration: Date.now() - start,
      });

      // Save failed execution and stop
      await prisma.execution.update({
        where: { id: executionId },
        data: {
          status: "failed",
          logs: logs as any,
          endedAt: new Date(),
        },
      });

      return; // stop execution
    }
  }

  // All nodes succeeded
  await prisma.execution.update({
    where: { id: executionId },
    data: {
      status: "success",
      logs: logs as any,
      endedAt: new Date(),
    },
  });
}
