import "server-only";

import { getPrisma } from "@/lib/prisma";
import type { UserSyncInput } from "@/server/users/types/user.types";

export function findUserBySupabaseId(supabaseUserId: string) {
  return getPrisma().user.findUnique({
    where: { supabaseUserId },
  });
}

export function findUserByEmail(email: string) {
  return getPrisma().user.findUnique({
    where: { email },
  });
}

export function upsertUserFromSupabase(input: UserSyncInput) {
  return getPrisma().user.upsert({
    where: { supabaseUserId: input.supabaseUserId },
    create: {
      supabaseUserId: input.supabaseUserId,
      email: input.email,
      name: input.name ?? null,
      avatarUrl: input.avatarUrl ?? null,
      provider: input.provider ?? null,
      emailVerified: input.emailVerified ?? false,
    },
    update: {
      email: input.email,
      name: input.name ?? null,
      avatarUrl: input.avatarUrl ?? null,
      provider: input.provider ?? null,
      emailVerified: input.emailVerified ?? false,
    },
  });
}
