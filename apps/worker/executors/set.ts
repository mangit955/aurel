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
  const variablesConfig = node.data.variables || [];
  const resolved: Record<string, any> = {};

  // Resolve each templated value
  variablesConfig.forEach(({ key, value }: any) => {
    resolved[key] = resolveTemplate(value, input);
  });

  return {
    status: "success",
    data: resolved,
  };
}
