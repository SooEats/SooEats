import "server-only";

import { getPrisma } from "@/lib/prisma";

export function getCartRepository() {
  const prisma = getPrisma();

  return {
    findActiveCart(userId: string) {
      return prisma.cart.findFirst({
        where: { userId, status: "ACTIVE" },
        include: { items: { include: { menuItem: true }, orderBy: { createdAt: "asc" } } },
      });
    },

    createActiveCart(userId: string) {
      return prisma.cart.create({
        data: { userId, status: "ACTIVE" },
        include: { items: { include: { menuItem: true } } },
      });
    },

    async getOrCreateActiveCart(userId: string) {
      const cart = await this.findActiveCart(userId);
      return cart ?? this.createActiveCart(userId);
    },
  };
}
