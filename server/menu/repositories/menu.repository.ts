import "server-only";

import { getPrisma } from "@/lib/prisma";

export function getMenuRepository() {
  const prisma = getPrisma();

  return {
    listAvailable() {
      return prisma.menuItem.findMany({
        where: { isAvailable: true },
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      });
    },

    findAvailableBySlug(slug: string) {
      return prisma.menuItem.findFirst({
        where: { slug, isAvailable: true },
      });
    },
  };
}
