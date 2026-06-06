import Link from "next/link";
import { redirect } from "next/navigation";
import { syncSupabaseUserToDatabase } from "@/server/auth/services/user-sync.service";
import { requireAuth } from "@/server/auth/middleware/require-auth.middleware";
import { listOrdersForUser } from "@/server/orders/services/order.service";
import { formatPaymentStatus } from "@/lib/orders/payment-status";
import { formatMoney } from "@/lib/format-money";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const authUser = await requireAuth("/account");
  const appUser = await syncSupabaseUserToDatabase(authUser);
  if (appUser.role === "ADMIN") {
    redirect("/admin");
  }
  const recentOrders = (await listOrdersForUser(appUser.id)).slice(0, 3);

  return (
    <main className="min-h-[75vh] px-4 py-20">
      <section className="mx-auto max-w-2xl bg-brown-50 p-8 sm:p-12">
        <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-orange-500">
          Your profile
        </p>
        <h1 className="mb-8 font-display text-4xl font-bold text-brown-900">
          Account
        </h1>

        <dl className="grid gap-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="mb-1 text-[10px] uppercase tracking-widest text-brown-400">
              Email
            </dt>
            <dd className="font-medium text-brown-900">{appUser.email}</dd>
          </div>
          <div>
            <dt className="mb-1 text-[10px] uppercase tracking-widest text-brown-400">
              Provider
            </dt>
            <dd className="font-medium text-brown-900">
              {appUser.provider || "email"}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-[10px] uppercase tracking-widest text-brown-400">
              Role
            </dt>
            <dd className="font-medium text-brown-900">{appUser.role}</dd>
          </div>
          <div>
            <dt className="mb-1 text-[10px] uppercase tracking-widest text-brown-400">
              Email verified
            </dt>
            <dd className="font-medium text-brown-900">
              {appUser.emailVerified ? "Yes" : "No"}
            </dd>
          </div>
        </dl>

        <div className="mt-10 border-t border-brown-100 pt-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-brown-900">
              Recent orders
            </h2>
            <Link href="/orders" className="text-xs font-semibold uppercase tracking-widest text-orange-600 hover:text-brown-900">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-brown-400">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/orders/${order.id}`} className="flex justify-between gap-4 bg-white px-4 py-3 text-sm transition-colors hover:bg-orange-50">
                  <span className="font-medium text-brown-900">Order #{order.id.slice(-8)}</span>
                  <span className="text-right">
                    <span className="block text-brown-500">{formatMoney(order.total, order.currency)}</span>
                    <span className="block text-[10px] uppercase tracking-widest text-brown-400">
                      {order.paymentMethod === "PAY_ON_DELIVERY" ? "Pay on delivery" : "Pay now"}
                    </span>
                    <span className="block text-[10px] uppercase tracking-widest text-orange-600">
                      {formatPaymentStatus(order.paymentStatus)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-brown-900 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-orange-600"
          >
            Go to homepage
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center border border-brown-300 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-brown-900 transition-colors hover:border-orange-500 hover:text-orange-600"
          >
            Browse menu
          </Link>
        </div>
      </section>
    </main>
  );
}
