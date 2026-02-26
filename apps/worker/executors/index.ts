import { httpExecutor } from "./http";
import { webhookTriggerExecutor } from "./webhook";
import { emailExecutor } from "./email";
import { setExecutor } from "./set";
import { ifExecutor } from "./if";

export async function executeNode(node: any, input: any) {
  switch (node.type) {
    case "webhookTrigger":
      return webhookTriggerExecutor(node, input);

    case "httpRequest":
      return httpExecutor(node, input);

    case "setVariable":
      return setExecutor(node, input);

    case "ifFilter":
      return ifExecutor(node, input);

    case "sendEmail":
      return emailExecutor(node, input);

    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}
