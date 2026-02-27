export async function ifExecutor(node: any, input: any) {
  const { field, operator, value } = node.data;

  // Workflows commonly pass `{ status: 'success', data: { ... } }` between nodes.
  // We need to unwrap it if it exists to get the real payload.
  const payload = input?.data !== undefined ? input.data : input;

  let actual = payload;
  if (field) {
    const path = String(field).split(".");
    for (let part of path) {
      actual = actual ? actual[part] : undefined;
    }
  }

  let pass = false;

  switch (operator) {
    case "equals":
    case "=":
    case "==":
    case "===":
      pass = String(actual) === String(value);
      break;

    case "contains":
      pass = String(actual).includes(String(value));
      break;

    case "greaterThan":
    case ">":
      pass = Number(actual) > Number(value);
      break;

    case "lessThan":
    case "<":
      pass = Number(actual) < Number(value);
      break;

    case "exists":
      pass = actual !== undefined && actual !== null;
      break;

    default:
      // If we don't know the operator, assume default condition depending on what makes sense,
      // here we fallback to equals to avoid unhandled errors blocking the run completely.
      pass = String(actual) === String(value);
  }

  return {
    status: "success",
    data: {
      ...payload,
      branch: pass ? "true" : "false",
    },
  };
}
