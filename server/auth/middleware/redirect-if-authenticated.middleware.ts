import "server-only";

import { redirect } from "next/navigation";
import { getAuthRedirects } from "@/lib/supabase/env";
import { getCurrentUser } from "@/server/auth/controllers/session.controller";

export async function redirectIfAuthenticated() {
  const user = await getCurrentUser();

  if (user) {
    redirect(getAuthRedirects().afterLogin);
  }
}
