import "server-only";

import { getPrisma } from "@/lib/prisma";

export async function restoreOrderInventory(orderId: string) {
  const prisma = getPrisma();

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.inventoryRestoredAt) return;

    const marked = await tx.order.updateMany({
      where: { id: orderId, inventoryRestoredAt: null },
      data: { inventoryRestoredAt: new Date() },
    });

    if (marked.count !== 1) return;

    for (const item of order.items) {
      if (!item.menuItemId) continue;

      await tx.menuItem.updateMany({
        where: { id: item.menuItemId, stockQuantity: { not: null } },
        data: { stockQuantity: { increment: item.quantity } },
      });
    }
  });
}
