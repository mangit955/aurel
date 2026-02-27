export async function webhookTriggerExecutor(node: any, input: any) {
  // Unwrap payload correctly (worker may wrap it as { data, status })
  const payload = input && input.data !== undefined ? input.data : input || {};

  // Webhook is always the entry point — just forward the raw JSON body
  return {
    status: "success",
    data: payload,
  };
}
