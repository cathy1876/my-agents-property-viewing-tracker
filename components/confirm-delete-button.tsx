"use client";

export function ConfirmDeleteButton({
  action,
  confirmMessage,
  label = "Delete",
  className = "",
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  label?: string;
  className?: string;
}) {
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
        className={`text-sm font-medium text-red-600 hover:text-red-700 ${className}`}
      >
        {label}
      </button>
    </form>
  );
}
