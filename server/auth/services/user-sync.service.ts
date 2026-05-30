import "server-only";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { ensureAppUser } from "@/server/users/services/user.service";

function readStringMetadata(
  metadata: SupabaseUser["user_metadata"],
  keys: string[]
) {
  for (const key of keys) {
    const value = metadata?.[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

export async function syncSupabaseUserToDatabase(user: SupabaseUser) {
  if (!user.email) {
    throw new Error("Supabase user cannot be synced without an email.");
  }

  const provider =
    user.identities?.[0]?.provider ||
    (typeof user.app_metadata?.provider === "string"
      ? user.app_metadata.provider
      : null);

  return ensureAppUser({
    supabaseUserId: user.id,
    email: user.email,
    name: readStringMetadata(user.user_metadata, ["username", "full_name", "name"]),
    avatarUrl: readStringMetadata(user.user_metadata, ["avatar_url", "picture"]),
    provider,
    emailVerified: Boolean(user.email_confirmed_at || user.confirmed_at),
  });
}

export async function ensureDatabaseUserForSession(user: SupabaseUser | null) {
  if (!user) {
    return null;
  }

  return syncSupabaseUserToDatabase(user);
}
