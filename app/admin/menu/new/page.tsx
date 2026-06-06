import Link from "next/link";
import { createMenuItemAction } from "@/app/admin/actions";
import { MenuItemForm } from "@/components/admin/menu-item-form";

export default function NewMenuItemPage() {
  return (
    <section className="max-w-4xl">
      <Link href="/admin/menu" className="text-xs font-bold uppercase tracking-widest text-orange-600">Back to menu</Link>
      <h1 className="mt-4 font-display text-4xl font-bold">Add menu item</h1>
      <div className="mt-8 border border-brown-100 bg-white p-6 shadow-sm sm:p-8">
        <MenuItemForm action={createMenuItemAction} submitLabel="Create item" />
      </div>
    </section>
  );
}
