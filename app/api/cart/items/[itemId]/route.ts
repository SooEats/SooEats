import { NextResponse } from "next/server";
import { getCurrentAppUser } from "@/server/auth/services/current-app-user.service";
import { removeCartItem, updateCartItemQuantity } from "@/server/cart/services/cart.service";

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getCurrentAppUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId } = await context.params;
  const body = (await request.json().catch(() => null)) as { quantity?: number } | null;
  const quantity = body?.quantity;
  if (typeof quantity !== "number" || !Number.isInteger(quantity)) {
    return NextResponse.json({ error: "quantity must be an integer" }, { status: 400 });
  }

  const cart = await updateCartItemQuantity(user.id, itemId, quantity);
  return NextResponse.json(cart);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getCurrentAppUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId } = await context.params;
  const cart = await removeCartItem(user.id, itemId);
  return NextResponse.json(cart);
}
