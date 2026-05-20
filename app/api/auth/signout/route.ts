import { NextResponse } from "next/server";
import { getAuthRedirects } from "@/lib/supabase/env";
import { signOut } from "@/server/auth/controllers/signout.controller";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;

  await signOut();

  return NextResponse.redirect(`${origin}${getAuthRedirects().afterLogout}`, 303);
}
