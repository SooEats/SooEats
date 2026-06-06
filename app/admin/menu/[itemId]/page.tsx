import Link from "next/link";
import { notFound } from "next/navigation";
import { updateMenuItemAction } from "@/app/admin/actions";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { getMenuItemForAdmin } from "@/server/menu/services/menu-admin.service";

type Props = { params: Promise<{ itemId: string }> };

export default async function EditMenuItemPage({ params }: Props) {
  const { itemId } = await params;
  const item = await getMenuItemForAdmin(itemId);
  if (!item) notFound();

  return (
    <section className="max-w-4xl">
      <Link href="/admin/menu" className="text-xs font-bold uppercase tracking-widest text-orange-600">Back to menu</Link>
      <h1 className="mt-4 font-display text-4xl font-bold">Edit {item.name}</h1>
      <div className="mt-8 border border-brown-100 bg-white p-6 shadow-sm sm:p-8">
        <MenuItemForm action={updateMenuItemAction} item={item} submitLabel="Save changes" />
      </div>
    </section>
  );
}
