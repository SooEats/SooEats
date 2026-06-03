import Link from "next/link";
import { requireAuth } from "@/server/auth/middleware/require-auth.middleware";
import { syncSupabaseUserToDatabase } from "@/server/auth/services/user-sync.service";
import { listOrdersForUser } from "@/server/orders/services/order.service";
import { formatPaymentStatus, getPaymentStatusTone } from "@/lib/orders/payment-status";
import { formatMoney } from "@/lib/format-money";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const authUser = await requireAuth("/orders");
  const appUser = await syncSupabaseUserToDatabase(authUser);
  const orders = await listOrdersForUser(appUser.id);

  return (
    <main className="min-h-[75vh] px-4 py-20">
      <section className="mx-auto max-w-4xl">
        <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-orange-500">
          Your orders
        </p>
        <h1 className="mb-8 font-display text-4xl font-bold text-brown-900">
          Order history
        </h1>

        {orders.length === 0 ? (
          <div className="bg-brown-50 p-8">
            <p className="text-brown-500">No orders yet.</p>
            <Link href="/menu" className="mt-5 inline-flex bg-brown-900 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white hover:bg-orange-600">
              Browse menu
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-brown-100 border-y border-brown-100">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="grid gap-3 py-5 transition-colors hover:bg-brown-50 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-semibold text-brown-900">Order #{order.id.slice(-8)}</p>
                  <p className="text-sm text-brown-400">
                    {new Date(order.createdAt).toLocaleString()} · {order.items.length} items
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold text-brown-900">{formatMoney(order.total, order.currency)}</p>
                  <p className="text-xs uppercase tracking-widest text-orange-500">{order.status}</p>
                  <p className="text-xs uppercase tracking-widest text-brown-400">
                    {order.paymentMethod === "PAY_ON_DELIVERY" ? "Pay on delivery" : "Pay now"}
                  </p>
                  <p className={`text-xs uppercase tracking-widest ${getPaymentStatusTone(order.paymentStatus)}`}>
                    Payment: {formatPaymentStatus(order.paymentStatus)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
