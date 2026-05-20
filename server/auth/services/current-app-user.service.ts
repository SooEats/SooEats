import "server-only";

import { getCurrentUser } from "@/server/auth/controllers/session.controller";
import { syncSupabaseUserToDatabase } from "@/server/auth/services/user-sync.service";

export async function getCurrentAppUser() {
  const authUser = await getCurrentUser();
  if (!authUser) return null;

  return syncSupabaseUserToDatabase(authUser);
}
