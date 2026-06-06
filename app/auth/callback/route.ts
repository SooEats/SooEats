import { NextResponse, type NextRequest } from "next/server";
import { getAuthRedirects } from "@/lib/supabase/env";
import { exchangeAuthCodeForSessionAndSyncUser } from "@/server/auth/controllers/session.controller";

function safeRedirectPath(value: string | null, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirects = getAuthRedirects();
  const requestedNext = searchParams.get("next");
  const next = safeRedirectPath(requestedNext, redirects.afterLogin);

  if (!code) {
    return NextResponse.redirect(`${origin}${redirects.onError}?reason=missing_code`);
  }

  try {
    const appUser = await exchangeAuthCodeForSessionAndSyncUser(code);
    const destination = requestedNext ? next : appUser.role === "ADMIN" ? "/admin" : next;
    return NextResponse.redirect(`${origin}${destination}`);
  } catch {
    return NextResponse.redirect(`${origin}${redirects.onError}?reason=user_sync_failed`);
  }
}
