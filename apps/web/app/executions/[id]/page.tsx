import ExecutionViewer from "@/app/components/ExecutionViewer";

export default async function ExecutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExecutionViewer executionId={id} />;
}
