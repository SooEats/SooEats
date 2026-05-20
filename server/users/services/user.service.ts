import "server-only";

import {
  findUserBySupabaseId,
  upsertUserFromSupabase,
} from "@/server/users/repositories/user.repository";
import type { UserSyncInput } from "@/server/users/types/user.types";

export function getAppUserBySupabaseUserId(supabaseUserId: string) {
  return findUserBySupabaseId(supabaseUserId);
}

export function ensureAppUser(input: UserSyncInput) {
  return upsertUserFromSupabase(input);
}
