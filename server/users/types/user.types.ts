import type { User } from "@/lib/generated/prisma/client";

export type AppUser = User;

export interface UserSyncInput {
  supabaseUserId: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  provider?: string | null;
  emailVerified?: boolean;
}
