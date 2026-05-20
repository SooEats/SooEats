"use server";

import { redirect } from "next/navigation";
import { getAuthRedirects } from "@/lib/supabase/env";
import { signInWithEmail } from "@/server/auth/controllers/email-auth.controller";
import { signInWithGoogle } from "@/server/auth/controllers/social-auth.controller";
import type { AuthActionResult } from "@/server/auth/types/auth.types";
import { loginSchema } from "@/server/auth/validators/auth.schema";

function safeNextPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

export async function loginWithEmailAction(
  _prevState: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
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
    await signInWithEmail(parsed.data);
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "We could not sign you in. Please try again.",
    };
  }

  redirect(parsed.data.next || getAuthRedirects().afterLogin);
}

export async function loginWithGoogleAction(formData: FormData) {
  const redirectUrl = await signInWithGoogle(safeNextPath(formData.get("next")));
  redirect(redirectUrl);
}
