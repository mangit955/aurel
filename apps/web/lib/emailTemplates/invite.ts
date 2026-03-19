import type { OrganizationRole } from "@/lib/organizations";

type InviteEmailTemplateParams = {
  organizationName: string;
  inviterName: string;
  inviteUrl: string;
  role: OrganizationRole;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildInviteEmailTemplate({
  organizationName,
  inviterName,
  inviteUrl,
  role,
}: InviteEmailTemplateParams) {
  const safeOrganizationName = escapeHtml(organizationName);
  const safeInviterName = escapeHtml(inviterName);
  const safeInviteUrl = escapeHtml(inviteUrl);
  const normalizedRole = escapeHtml(role.toLowerCase());

  return {
    subject: `You're invited to join ${organizationName} on Aurel`,
    body: `
      <div style="margin:0;background:#09090b;padding:32px 16px;font-family:Arial,sans-serif;color:#e4e4e7;">
        <div style="margin:0 auto;max-width:640px;overflow:hidden;border:1px solid #27272a;border-radius:24px;background:linear-gradient(180deg,#18181b 0%,#0f0f12 100%);box-shadow:0 24px 80px rgba(0,0,0,0.45);">
          <div style="padding:32px 32px 24px;background:radial-gradient(circle at top left,rgba(255,255,255,0.14),transparent 34%),radial-gradient(circle at right,rgba(161,161,170,0.22),transparent 26%),#111113;">
            <div style="display:inline-block;border:1px solid rgba(255,255,255,0.14);border-radius:999px;padding:8px 12px;background:rgba(255,255,255,0.04);font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#a1a1aa;">
              aurel.
            </div>
            <h1 style="margin:20px 0 12px;font-size:32px;line-height:1.15;font-weight:700;letter-spacing:-0.04em;color:#fafafa;">
              Join ${safeOrganizationName}
            </h1>
            <p style="margin:0;max-width:480px;font-size:15px;line-height:1.7;color:#c4c4cc;">
              ${safeInviterName} invited you to collaborate in <strong style="color:#ffffff;">${safeOrganizationName}</strong> on Aurel as a <strong style="color:#ffffff;text-transform:capitalize;">${normalizedRole}</strong>.
            </p>
          </div>

          <div style="padding:0 32px 32px;">
            <div style="margin-top:-6px;border:1px solid #27272a;border-radius:20px;background:#0b0b0d;padding:24px;">
              <div style="margin-bottom:18px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#71717a;">
                Workspace Access
              </div>
              <div style="margin-bottom:22px;font-size:14px;line-height:1.7;color:#d4d4d8;">
                Accept the invite to access shared workflows, execution history, and workspace settings.
              </div>
              <a href="${safeInviteUrl}" style="display:inline-block;border-radius:12px;background:#f4f4f5;padding:14px 20px;font-size:14px;font-weight:700;color:#09090b;text-decoration:none;">
                Accept invite
              </a>
            </div>

            <div style="margin-top:20px;border-top:1px solid #27272a;padding-top:20px;">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#71717a;">
                Direct link
              </p>
              <p style="margin:0;font-size:13px;line-height:1.7;color:#a1a1aa;word-break:break-all;">
                ${safeInviteUrl}
              </p>
            </div>
          </div>
        </div>
      </div>
    `,
  };
}
