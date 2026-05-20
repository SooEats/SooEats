const missingSupabaseEnvError =
  "Supabase env vars are required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.";

export function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(missingSupabaseEnvError);
  }

  return { supabaseUrl, supabaseKey };
}

export function getOptionalSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return { supabaseUrl, supabaseKey };
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function getAuthRedirects() {
  return {
    afterLogin: process.env.AUTH_REDIRECT_AFTER_LOGIN || "/account",
    afterLogout: process.env.AUTH_REDIRECT_AFTER_LOGOUT || "/login",
    afterSignup: process.env.AUTH_REDIRECT_AFTER_SIGNUP || "/account",
    onError: process.env.AUTH_REDIRECT_ON_ERROR || "/auth/error",
  };
}
