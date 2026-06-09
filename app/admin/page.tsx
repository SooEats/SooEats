import Link from "next/link";
import { getAdminDashboardMetrics } from "@/server/admin/dashboard.service";
import { formatAdminDateTime } from "@/lib/admin-date-time";
import { formatMoney } from "@/lib/format-money";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const metrics = await getAdminDashboardMetrics();
  const cards = [
    ["Orders today", metrics.ordersToday],
    ["Orders requiring action", metrics.pendingOrders],
    ["Completed orders", metrics.completedOrders],
    ["Active menu items", metrics.menuItems],
    ["Low stock items", metrics.lowStockItems],
    ["Paid revenue", formatMoney(metrics.revenue, "CAD")],
  ];

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">Admin workspace</p>
      <h1 className="mt-3 font-display text-4xl font-bold">Overview</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="border border-brown-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-brown-400">{label}</p>
            <p className="mt-3 text-3xl font-bold text-brown-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 border border-brown-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-bold">Recent orders</h2>
          <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-orange-600 hover:text-brown-900">
            View all
          </Link>
        </div>
        <div className="mt-5 divide-y divide-brown-100">
          {metrics.recentOrders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`} className="grid gap-2 py-4 text-sm transition hover:bg-brown-50 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:px-3">
              <div>
                <p className="font-semibold">#{order.id.slice(-8)} · {order.customerName}</p>
                <p className="text-brown-400">{formatAdminDateTime(order.createdAt)} · {order.items.length} line items</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600">{order.status}</span>
              <span className="font-bold">{formatMoney(Number(order.total), order.currency)}</span>
            </Link>
          ))}
          {metrics.recentOrders.length === 0 ? <p className="py-8 text-sm text-brown-400">No orders yet.</p> : null}
        </div>
      </div>
    </section>
  );
}
