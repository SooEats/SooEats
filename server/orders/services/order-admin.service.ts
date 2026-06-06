import "server-only";

import type { OrderStatus } from "@/lib/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import { restoreOrderInventory } from "@/server/orders/services/order-inventory.service";

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  CANCELLED: [],
  COMPLETED: [],
};

export function listOrdersForAdmin() {
  return getPrisma().order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, address: true, user: true },
  });
}

export function getOrderForAdmin(id: string) {
  return getPrisma().order.findUnique({
    where: { id },
    include: {
      items: true,
      address: true,
      user: true,
      payments: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function updateOrderStatusForAdmin(id: string, nextStatus: OrderStatus) {
  const prisma = getPrisma();
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) throw new Error("Order not found.");
  if (!allowedTransitions[order.status].includes(nextStatus)) {
    throw new Error(`Cannot change ${order.status} order to ${nextStatus}.`);
  }

  await prisma.order.update({
    where: { id },
    data: { status: nextStatus },
  });

  if (nextStatus === "CANCELLED") {
    await restoreOrderInventory(id);
  }
}

export function getAllowedOrderTransitions(status: OrderStatus) {
  return allowedTransitions[status];
}
