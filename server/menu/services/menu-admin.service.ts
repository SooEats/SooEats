import "server-only";

import { getPrisma } from "@/lib/prisma";
import type { MenuAdminInput } from "@/server/menu/validators/menu-admin.schema";

export function listMenuItemsForAdmin() {
  return getPrisma().menuItem.findMany({
    orderBy: [{ archivedAt: "asc" }, { category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
}

export function getMenuItemForAdmin(id: string) {
  return getPrisma().menuItem.findUnique({ where: { id } });
}

export function createMenuItem(input: MenuAdminInput) {
  return getPrisma().menuItem.create({ data: input });
}

export function updateMenuItem(id: string, input: MenuAdminInput) {
  return getPrisma().menuItem.update({ where: { id }, data: input });
}

export function archiveMenuItem(id: string) {
  return getPrisma().menuItem.update({
    where: { id },
    data: { archivedAt: new Date(), isAvailable: false },
  });
}

export function restoreMenuItem(id: string) {
  return getPrisma().menuItem.update({
    where: { id },
    data: { archivedAt: null },
  });
}
