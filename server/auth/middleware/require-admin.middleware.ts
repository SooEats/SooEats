import "server-only";

import { redirect } from "next/navigation";
import { getCurrentAppUser } from "@/server/auth/services/current-app-user.service";

export async function requireAdmin(nextPath = "/admin") {
  const user = await getCurrentAppUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  if (user.role !== "ADMIN") {
    redirect("/account");
  }

  return user;
}

export async function getCurrentAdmin() {
  const user = await getCurrentAppUser();
  return user?.role === "ADMIN" ? user : null;
}
