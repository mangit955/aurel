// apps/worker/executors/email.ts

import { Resend } from "resend";

// create inside worker so your API key stays safe
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function emailExecutor(node: any, input: any) {
  const { to, subject, body, from } = node.data;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: body,
    });

    if (error) {
      return { status: "failed", error: error.message };
    }

    return { status: "success", data };
  } catch (err: any) {
    return { status: "failed", error: err.message };
  }
}
