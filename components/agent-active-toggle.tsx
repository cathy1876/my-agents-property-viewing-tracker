"use client";

export function AgentActiveToggle({
  isActive,
  action,
}: {
  isActive: boolean;
  action: () => Promise<void>;
}) {
  const confirmMessage = isActive
    ? "Deactivate this agent? They will no longer be able to log in. Their existing Viewings, Clients, and Properties are unaffected and stay fully visible to Admin."
    : "Reactivate this agent? They will be able to log in again.";

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className={`text-sm font-medium ${
          isActive
            ? "text-red-600 hover:text-red-700"
            : "text-green-700 hover:text-green-800"
        }`}
      >
        {isActive ? "Deactivate" : "Reactivate"}
      </button>
    </form>
  );
}
