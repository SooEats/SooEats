import "server-only";

import { getPrisma } from "@/lib/prisma";

export function getOrderRepository() {
  const prisma = getPrisma();

  return {
    listForUser(userId: string) {
      return prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { items: true, address: true },
      });
    },

    findForUser(userId: string, orderId: string) {
      return prisma.order.findFirst({
        where: { id: orderId, userId },
        include: { items: true, address: true },
      });
    },
  };
}
