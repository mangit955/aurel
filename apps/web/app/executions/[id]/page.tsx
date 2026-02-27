import ExecutionViewer from "@/app/components/ExecutionViewer";

export default async function ExecutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Execution Detail</h1>
      <ExecutionViewer executionId={id} />
    </div>
  );
}
