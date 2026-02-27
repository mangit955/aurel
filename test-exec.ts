import { prisma } from "@db/index";


async function run() {
  const ex = await prisma.execution.findMany({
    take: 3,
    orderBy: { startedAt: "desc" },
  });
  console.log(JSON.stringify(ex, null, 2));
}

run();
