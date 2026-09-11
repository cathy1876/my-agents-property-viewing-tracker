import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ blocked?: string }>;
}) {
  const { blocked } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        Viewing Tracker
      </h1>
      <p className="mb-6 text-sm text-neutral-500">Sign in to continue.</p>
      {blocked && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          Your session is no longer valid. Contact Support at [Tel. No.
          XXXXXXXX] if you believe this is a mistake.
        </div>
      )}
      <LoginForm />
    </div>
  );
}
