import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getAuthRedirects } from "@/lib/supabase/env";
import {
  exchangeAuthCodeForSessionAndSyncUser,
  verifyOtpAndSyncUser,
} from "@/server/auth/controllers/session.controller";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const redirects = getAuthRedirects();

  if (!code && (!tokenHash || !type)) {
    return NextResponse.redirect(`${origin}${redirects.onError}?reason=missing_code`);
  }

  try {
    if (code) {
      await exchangeAuthCodeForSessionAndSyncUser(code);
    } else {
      await verifyOtpAndSyncUser(tokenHash!, type!);
    }

    return NextResponse.redirect(`${origin}${redirects.afterSignup}`);
  } catch {
    return NextResponse.redirect(`${origin}${redirects.onError}?reason=confirmation_failed`);
  }
}
