// apps/worker/utils/resolveTemplate.ts

export function resolveTemplate(
  template: string,
  context: Record<string, any>,
) {
  if (!template) return template;

  return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const path = key.trim().split(".");
    let value: any = context;

    for (const part of path) {
      if (value == null) return "";
      value = value[part];
    }

    return value != null ? String(value) : "";
  });
}
