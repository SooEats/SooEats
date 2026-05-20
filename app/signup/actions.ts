"use server";

import { redirect } from "next/navigation";
import { getAuthRedirects } from "@/lib/supabase/env";
import { signUpWithEmail } from "@/server/auth/controllers/email-auth.controller";
import { signInWithGoogle } from "@/server/auth/controllers/social-auth.controller";
import type { AuthActionResult } from "@/server/auth/types/auth.types";
import { signupSchema } from "@/server/auth/validators/auth.schema";

function safeNextPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

export async function signupWithEmailAction(
  _prevState: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    next: formData.get("next") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
      message: "Please check your email and password.",
    };
  }

  try {
    const data = await signUpWithEmail(parsed.data);

    if (!data.session) {
      return {
        ok: true,
        message: "Check your email to confirm your account, then sign in.",
      };
    }
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "We could not create your account. Please try again.",
    };
  }

  redirect(parsed.data.next || getAuthRedirects().afterSignup);
}

export async function signupWithGoogleAction(formData: FormData) {
  const redirectUrl = await signInWithGoogle(safeNextPath(formData.get("next")));
  redirect(redirectUrl);
}
