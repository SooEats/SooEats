import "server-only";

import type { MenuItem } from "@/lib/generated/prisma/client";
import type { FoodItem } from "@/lib/data/menu";

const categoryMap = {
  BREAKFAST: "breakfast",
  LUNCH: "lunch",
  DRINKS: "drinks",
  DESSERT: "dessert",
} as const;

export type PublicMenuItem = FoodItem & {
  isAvailable: boolean;
  sortOrder: number;
};

function toNumber(value: { toNumber?: () => number } | number) {
  return typeof value === "number" ? value : value.toNumber?.() ?? Number(value);
}

export function mapMenuItemToFoodItem(item: MenuItem): PublicMenuItem {
  return {
    id: item.slug,
    name: item.name,
    description: item.description,
    price: toNumber(item.price),
    image: item.imageUrl,
    serving: item.serving,
    category: categoryMap[item.category],
    macros: {
      calories: toNumber(item.calories),
      protein: toNumber(item.protein),
      carbs: toNumber(item.carbs),
      fats: toNumber(item.fats),
    },
    isAvailable:
      item.isAvailable &&
      item.archivedAt === null &&
      (item.stockQuantity === null || item.stockQuantity > 0),
    sortOrder: item.sortOrder,
  };
}
