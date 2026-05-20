import "server-only";

import { getAppUserBySupabaseUserId } from "@/server/users/services/user.service";

export async function getUserAccount(supabaseUserId: string) {
  return getAppUserBySupabaseUserId(supabaseUserId);
}
