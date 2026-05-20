import { NextResponse } from "next/server";
import { getCurrentAppUser } from "@/server/auth/services/current-app-user.service";
import { addCartItem } from "@/server/cart/services/cart.service";

export async function POST(request: Request) {
  const user = await getCurrentAppUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { menuItemId?: string } | null;
  if (!body?.menuItemId) {
    return NextResponse.json({ error: "menuItemId is required" }, { status: 400 });
  }

  try {
    const cart = await addCartItem(user.id, body.menuItemId);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to add item" },
      { status: 400 }
    );
  }
}
