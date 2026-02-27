import { prisma } from "@aurel/db";

async function main() {
  const executions = await prisma.execution.findMany({
    orderBy: { startedAt: "desc" },
    take: 3,
  });
  
  for (const ex of executions) {
    console.log(`Execution ${ex.id} - ${ex.status}`);
    console.log(JSON.stringify(ex.logs, null, 2));
    console.log("-------------------");
  }
}

main().catch(console.error).finally(() => process.exit(0));
