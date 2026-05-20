"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AuthErrorMessage } from "@/components/auth/auth-error-message";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import type { AuthActionResult } from "@/server/auth/types/auth.types";

const initialState: AuthActionResult = { ok: false };

export function AuthForm({
  action,
  mode,
  next,
}: {
  action: (
    prevState: AuthActionResult,
    formData: FormData
  ) => Promise<AuthActionResult>;
  mode: "login" | "signup";
  next?: string;
}) {
  const [state, formAction] = useActionState(action, initialState);
  const isLogin = mode === "login";

  return (
    <form action={formAction} className="space-y-6">
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <label
          htmlFor={`${mode}-email`}
          className="mb-2 block text-[11px] uppercase tracking-widest text-brown-500"
        >
          Email Address
        </label>
        <input
          id={`${mode}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="jane@example.com"
          className="w-full border border-brown-200 bg-white px-4 py-3 text-sm text-brown-800 placeholder-brown-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-xs text-red-500">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${mode}-password`}
          className="mb-2 block text-[11px] uppercase tracking-widest text-brown-500"
        >
          Password
        </label>
        <input
          id={`${mode}-password`}
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          className="w-full border border-brown-200 bg-white px-4 py-3 text-sm text-brown-800 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {state.fieldErrors?.password && (
          <p className="mt-1 text-xs text-red-500">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      {!isLogin && (
        <div>
          <label
            htmlFor={`${mode}-confirm-password`}
            className="mb-2 block text-[11px] uppercase tracking-widest text-brown-500"
          >
            Confirm Password
          </label>
          <input
            id={`${mode}-confirm-password`}
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="w-full border border-brown-200 bg-white px-4 py-3 text-sm text-brown-800 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {state.fieldErrors?.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {state.fieldErrors.confirmPassword[0]}
            </p>
          )}
        </div>
      )}

      <AuthSubmitButton>{isLogin ? "Sign in" : "Create account"}</AuthSubmitButton>
      <AuthErrorMessage state={state} />

      <p className="text-center text-sm text-brown-500">
        {isLogin ? "New to SOOEATS?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-semibold text-orange-600 hover:text-orange-700"
        >
          {isLogin ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
