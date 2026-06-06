import "server-only";

import { menuItems } from "@/lib/data/menu";
import { getMenuRepository } from "@/server/menu/repositories/menu.repository";
import { mapMenuItemToFoodItem } from "@/server/menu/services/menu.mapper";

export async function listMenuItems() {
  try {
    const items = await getMenuRepository().listAll();
    return items.map(mapMenuItemToFoodItem);
  } catch {
    return menuItems.map((item, sortOrder) => ({
      ...item,
      isAvailable: item.isAvailable ?? true,
      sortOrder,
    }));
  }
}
