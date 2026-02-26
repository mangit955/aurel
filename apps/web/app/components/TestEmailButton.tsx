"use client";

export function TestEmailButton({ nodeId }: { nodeId: string }) {
  const handleClick = async () => {
    try {
      const res = await fetch(`/api/emails/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeId,
          from: "onboarding@resend.dev", // Add the from field
          to: "manasraghuwanshi272004@gmail.com", // Example value
          subject: "Test Email from Aurel",
          body: "<h1>This is a test email</h1>",
        }),
      });

      if (!res.ok) {
        console.error("Failed to send test email", await res.text());
        alert("Failed to send test email");
        return;
      }

      console.log("Test email successfully triggered!");
      alert("Test email sent!");
    } catch (err) {
      console.error(err);
      alert("Error sending test email");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="btn btn-secondary border p-1 rounded-md bg-zinc-200"
    >
      Send Test Email
    </button>
  );
}
