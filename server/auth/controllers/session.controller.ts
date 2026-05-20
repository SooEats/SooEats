import "server-only";

import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { syncSupabaseUserToDatabase } from "@/server/auth/services/user-sync.service";

export async function getCurrentSession() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return data.session;
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}

export async function exchangeAuthCodeForSessionAndSyncUser(code: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    throw error;
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw userError ?? new Error("Unable to load user after auth callback.");
  }

  return syncSupabaseUserToDatabase(user);
}

export async function verifyOtpAndSyncUser(tokenHash: string, type: EmailOtpType) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("Unable to load user after email confirmation.");
  }

  return syncSupabaseUserToDatabase(data.user);
}
