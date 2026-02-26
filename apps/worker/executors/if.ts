export async function ifExecutor(node: any, input: any) {
  const { field, operator, value } = node.data;
  const actual = input?.[field];

  let pass = false;

  switch (operator) {
    case "equals":
      pass = actual === value;
      break;

    case "contains":
      pass = String(actual).includes(String(value));
      break;

    case "greaterThan":
      pass = Number(actual) > Number(value);
      break;

    case "exists":
      pass = actual !== undefined && actual !== null;
      break;

    default:
      throw new Error(`Unknown operator ${operator}`);
  }

  return {
    status: "success",
    data: { branch: pass ? "true" : "false" },
  };
}
