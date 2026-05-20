import Link from "next/link";

const messages: Record<string, string> = {
  missing_code: "The authentication callback was missing its verification code.",
  user_sync_failed: "You signed in, but we could not finish creating your account profile.",
  confirmation_failed: "We could not confirm your email address.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const message =
    reason && messages[reason]
      ? messages[reason]
      : "Something went wrong while signing you in.";

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <section className="max-w-md text-center">
        <p className="text-[11px] uppercase tracking-[0.35em] text-orange-500 mb-4">
          Account issue
        </p>
        <h1 className="font-display font-bold text-4xl text-brown-900 mb-4">
          Sign-in failed
        </h1>
        <p className="text-brown-500 mb-8">{message}</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center bg-brown-900 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-orange-600"
        >
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
