import "server-only";

import { getPrisma } from "@/lib/prisma";

export function getMenuRepository() {
  const prisma = getPrisma();

  return {
    listAll() {
      return prisma.menuItem.findMany({
        where: { archivedAt: null },
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      });
    },

    listAvailable() {
      return prisma.menuItem.findMany({
        where: {
          archivedAt: null,
          isAvailable: true,
          OR: [{ stockQuantity: null }, { stockQuantity: { gt: 0 } }],
        },
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      });
    },

    findAvailableBySlug(slug: string) {
      return prisma.menuItem.findFirst({
        where: {
          slug,
          archivedAt: null,
          isAvailable: true,
          OR: [{ stockQuantity: null }, { stockQuantity: { gt: 0 } }],
        },
      });
    },
  };
}
