import { NextResponse } from "next/server";
import { getCurrentAppUser } from "@/server/auth/services/current-app-user.service";
import { clearActiveCart, getActiveCartForUser } from "@/server/cart/services/cart.service";

export async function GET() {
  const user = await getCurrentAppUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await getActiveCartForUser(user.id);
  return NextResponse.json(cart);
}

export async function DELETE() {
  const user = await getCurrentAppUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await clearActiveCart(user.id);
  return NextResponse.json(cart);
}
