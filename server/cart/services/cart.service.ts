import "server-only";

import { getPrisma } from "@/lib/prisma";
import { getCartRepository } from "@/server/cart/repositories/cart.repository";
import { mapMenuItemToFoodItem } from "@/server/menu/services/menu.mapper";

function toNumber(value: { toNumber?: () => number } | number) {
  return typeof value === "number" ? value : value.toNumber?.() ?? Number(value);
}

function serializeCart(cart: Awaited<ReturnType<ReturnType<typeof getCartRepository>["findActiveCart"]>>) {
  if (!cart) {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }

  const items = cart.items.map((cartItem) => ({
    item: {
      ...mapMenuItemToFoodItem(cartItem.menuItem),
      price: toNumber(cartItem.unitPrice),
    },
    quantity: cartItem.quantity,
  }));

  return {
    id: cart.id,
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.item.price * item.quantity, 0),
  };
}

export async function getActiveCartForUser(userId: string) {
  const cart = await getCartRepository().findActiveCart(userId);
  return serializeCart(cart);
}

export async function addCartItem(userId: string, menuItemSlug: string) {
  const prisma = getPrisma();
  const cart = await getCartRepository().getOrCreateActiveCart(userId);
  const menuItem = await prisma.menuItem.findFirst({
    where: {
      slug: menuItemSlug,
      archivedAt: null,
      isAvailable: true,
      OR: [{ stockQuantity: null }, { stockQuantity: { gt: 0 } }],
    },
  });

  if (!menuItem) {
    throw new Error("Menu item is unavailable.");
  }

  const existingItem = cart.items.find((item) => item.menuItemId === menuItem.id);
  if (menuItem.stockQuantity !== null && (existingItem?.quantity ?? 0) >= menuItem.stockQuantity) {
    throw new Error("No more stock is available for this item.");
  }

  await prisma.cartItem.upsert({
    where: { cartId_menuItemId: { cartId: cart.id, menuItemId: menuItem.id } },
    create: {
      cartId: cart.id,
      menuItemId: menuItem.id,
      quantity: 1,
      unitPrice: menuItem.price,
    },
    update: { quantity: { increment: 1 } },
  });

  return getActiveCartForUser(userId);
}

export async function updateCartItemQuantity(userId: string, menuItemSlug: string, quantity: number) {
  const prisma = getPrisma();
  const cart = await getCartRepository().findActiveCart(userId);
  if (!cart) return serializeCart(null);

  const item = cart.items.find((cartItem) => cartItem.menuItem.slug === menuItemSlug);
  if (!item) return serializeCart(cart);

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
  } else {
    if (
      !item.menuItem.isAvailable ||
      item.menuItem.archivedAt ||
      (item.menuItem.stockQuantity !== null && quantity > item.menuItem.stockQuantity)
    ) {
      throw new Error("The requested quantity is unavailable.");
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });
  }

  return getActiveCartForUser(userId);
}

export async function removeCartItem(userId: string, menuItemSlug: string) {
  return updateCartItemQuantity(userId, menuItemSlug, 0);
}

export async function clearActiveCart(userId: string) {
  const prisma = getPrisma();
  const cart = await getCartRepository().findActiveCart(userId);
  if (!cart) return serializeCart(null);

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return getActiveCartForUser(userId);
}
