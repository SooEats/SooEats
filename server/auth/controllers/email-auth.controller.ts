import "server-only";

import { getSiteUrl } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AUTH_ROUTES } from "@/server/auth/routes/auth.routes";
import { syncSupabaseUserToDatabase } from "@/server/auth/services/user-sync.service";
import type { AuthCredentials } from "@/server/auth/types/auth.types";

export async function signInWithEmail({ email, password }: AuthCredentials) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (data.user) {
    await syncSupabaseUserToDatabase(data.user);
  }

  return data;
}

export async function signUpWithEmail({ email, password, username }: AuthCredentials) {
  const supabase = await createSupabaseServerClient();
  const emailRedirectTo = new URL(AUTH_ROUTES.confirm, getSiteUrl()).toString();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: username
        ? {
            username,
            name: username,
          }
        : undefined,
    },
  });

  if (error) {
    throw error;
  }

  if (data.user && data.session) {
    await syncSupabaseUserToDatabase(data.user);
  }

  return data;
}
