import "server-only";

import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/server/auth/routes/auth.routes";
import { getCurrentUser } from "@/server/auth/controllers/session.controller";

export async function requireAuth(nextPath?: string) {
  const user = await getCurrentUser();

  if (!user) {
    const loginUrl = new URL(AUTH_ROUTES.login, "http://local");
    if (nextPath) {
      loginUrl.searchParams.set("next", nextPath);
    }

    redirect(`${loginUrl.pathname}${loginUrl.search}`);
  }

  return user;
}
