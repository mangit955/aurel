// apps/worker/executors/email.ts

import { Resend } from "resend";
import { resolveTemplate } from "../utils/resolveTemplate";

// create inside worker so your API key stays safe
const resend = new Resend(process.env.RESEND_API_KEY!);
console.log("ENV FROM:", process.env.RESEND_FROM_EMAIL);
export async function emailExecutor(node: any, input: any) {
  const { to, subject, body } = node.data;
  const from = node.data.from || process.env.RESEND_FROM_EMAIL;

  // Apply template resolution using execution input context
  const resolvedTo = typeof to === "string" ? resolveTemplate(to, input) : to;
  const resolvedSubject = resolveTemplate(subject, input);
  const resolvedBody = resolveTemplate(body, input);

  try {
    if (!from) {
      return {
        status: "failed",
        error:
          "Missing `from` field. Set it in node config or RESEND_FROM_EMAIL env.",
      };
    }
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(resolvedTo) ? resolvedTo : [resolvedTo],
      subject: resolvedSubject,
      html: resolvedBody,
    });

    if (error) {
      return { status: "failed", error: error.message };
    }

    return { status: "success", data };
  } catch (err: any) {
    return { status: "failed", error: err.message };
  }
}
