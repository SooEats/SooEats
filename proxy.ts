import type { NextRequest } from "next/server";
import { refreshSessionMiddleware } from "@/server/auth/middleware/refresh-session.middleware";

export async function proxy(request: NextRequest) {
  return refreshSessionMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
