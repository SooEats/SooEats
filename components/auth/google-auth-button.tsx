"use client";

import { useFormStatus } from "react-dom";

function GoogleButtonContent() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="flex w-full items-center justify-center gap-3 border border-brown-200 bg-white px-5 py-3 text-sm font-semibold text-brown-800 transition-colors hover:border-orange-400 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-brown-200 text-xs font-bold">
        G
      </span>
      {pending ? "Connecting..." : "Continue with Google"}
    </button>
  );
}

export function GoogleAuthButton({
  action,
  next,
}: {
  action: (formData: FormData) => void | Promise<void>;
  next?: string;
}) {
  return (
    <form action={action}>
      {next && <input type="hidden" name="next" value={next} />}
      <GoogleButtonContent />
    </form>
  );
}
