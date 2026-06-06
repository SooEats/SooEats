import Link from "next/link";
import { archiveMenuItemAction, restoreMenuItemAction } from "@/app/admin/actions";
import { listMenuItemsForAdmin } from "@/server/menu/services/menu-admin.service";
import { formatMoney } from "@/lib/format-money";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const items = await listMenuItemsForAdmin();

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">Catalog</p>
          <h1 className="mt-3 font-display text-4xl font-bold">Menu management</h1>
        </div>
        <Link href="/admin/menu/new" className="bg-brown-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-orange-600">
          Add menu item
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-brown-100 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-brown-100 bg-brown-50 text-[11px] uppercase tracking-widest text-brown-500">
            <tr>
              <th className="px-5 py-4">Item</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brown-100">
            {items.map((item) => (
              <tr key={item.id} className={item.archivedAt ? "bg-brown-50 text-brown-400" : ""}>
                <td className="px-5 py-4">
                  <p className="font-semibold text-brown-900">{item.name}</p>
                  <p className="text-xs text-brown-400">{item.slug}</p>
                </td>
                <td className="px-5 py-4">{item.category}</td>
                <td className="px-5 py-4 font-semibold">{formatMoney(Number(item.price), "CAD")}</td>
                <td className="px-5 py-4">{item.stockQuantity ?? "Unlimited"}</td>
                <td className="px-5 py-4">
                  {item.archivedAt ? "Archived" : item.isAvailable ? "Available" : "Unavailable"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/menu/${item.id}`} className="font-semibold text-orange-600 hover:text-brown-900">Edit</Link>
                    <form action={item.archivedAt ? restoreMenuItemAction : archiveMenuItemAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button className="font-semibold text-brown-500 hover:text-red-600">
                        {item.archivedAt ? "Restore" : "Archive"}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
