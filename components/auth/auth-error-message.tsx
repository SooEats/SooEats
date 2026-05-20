import type { AuthActionResult } from "@/server/auth/types/auth.types";

export function AuthErrorMessage({ state }: { state: AuthActionResult }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={
        state.ok
          ? "text-center text-sm font-medium text-green-600"
          : "text-center text-sm font-medium text-red-500"
      }
      role="status"
    >
      {state.message}
    </p>
  );
}
