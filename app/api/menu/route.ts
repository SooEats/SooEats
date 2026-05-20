import { NextResponse } from "next/server";
import { listMenuItems } from "@/server/menu/services/menu.service";

export async function GET() {
  const items = await listMenuItems();
  return NextResponse.json({ items });
}
