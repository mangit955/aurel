function resolveTemplate(template: string, context: Record<string, any>) {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const path = key.trim().split(".");
    let value = context;

    for (let part of path) {
      value = value ? value[part] : "";
    }

    // If value is undefined/null, convert to empty string
    return value != null ? String(value) : "";
  });
}

export async function setExecutor(node: any, input: any) {
  // unwrap previous payload correctly
  const payload = input && input.data !== undefined ? input.data : input || {};

  // Support both single key/value (new UI) and variables array (old format)
  const variablesConfig =
    node.data?.variables?.length > 0
      ? node.data.variables
      : node.data?.key
        ? [{ key: node.data.key, value: node.data.value }]
        : [];

  const resolved: Record<string, any> = { ...payload };

  variablesConfig.forEach(({ key, value }: any) => {
    resolved[key] = resolveTemplate(value || "", payload);
  });

  return {
    status: "success",
    data: resolved,
  };
}
