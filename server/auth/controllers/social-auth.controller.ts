import "server-only";

import { getSiteUrl } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AUTH_ROUTES } from "@/server/auth/routes/auth.routes";

export async function signInWithGoogle(next?: string | null) {
  const supabase = await createSupabaseServerClient();
  const redirectTo = new URL(AUTH_ROUTES.callback, getSiteUrl());

  if (next) {
    redirectTo.searchParams.set("next", next);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTo.toString(),
    },
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    throw new Error("Google sign-in did not return a redirect URL.");
  }

  return data.url;
}
