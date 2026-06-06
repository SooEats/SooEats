"use server";

import type { OrderStatus } from "@/lib/generated/prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/middleware/require-admin.middleware";
import {
  archiveMenuItem,
  createMenuItem,
  restoreMenuItem,
  updateMenuItem,
} from "@/server/menu/services/menu-admin.service";
import { menuAdminSchema } from "@/server/menu/validators/menu-admin.schema";
import { updateOrderStatusForAdmin } from "@/server/orders/services/order-admin.service";

function parseMenuForm(formData: FormData) {
  return menuAdminSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
    serving: formData.get("serving"),
    category: formData.get("category"),
    calories: formData.get("calories"),
    protein: formData.get("protein"),
    carbs: formData.get("carbs"),
    fats: formData.get("fats"),
    isAvailable: formData.get("isAvailable") === "on",
    stockQuantity: formData.get("stockQuantity"),
    sortOrder: formData.get("sortOrder"),
  });
}

function refreshMenuPages() {
  revalidatePath("/admin");
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/nutrition");
}

export async function createMenuItemAction(formData: FormData) {
  await requireAdmin("/admin/menu/new");
  await createMenuItem(parseMenuForm(formData));
  refreshMenuPages();
  redirect("/admin/menu");
}

export async function updateMenuItemAction(formData: FormData) {
  await requireAdmin("/admin/menu");
  const id = String(formData.get("id") || "");
  await updateMenuItem(id, parseMenuForm(formData));
  refreshMenuPages();
  redirect("/admin/menu");
}

export async function archiveMenuItemAction(formData: FormData) {
  await requireAdmin("/admin/menu");
  await archiveMenuItem(String(formData.get("id") || ""));
  refreshMenuPages();
}

export async function restoreMenuItemAction(formData: FormData) {
  await requireAdmin("/admin/menu");
  await restoreMenuItem(String(formData.get("id") || ""));
  refreshMenuPages();
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin("/admin/orders");
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)) {
    throw new Error("Invalid order status.");
  }
  await updateOrderStatusForAdmin(id, status as OrderStatus);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath(`/orders/${id}`);
}
