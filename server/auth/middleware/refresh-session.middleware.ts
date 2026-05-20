import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

export function refreshSessionMiddleware(request: NextRequest) {
  return updateSupabaseSession(request);
}
