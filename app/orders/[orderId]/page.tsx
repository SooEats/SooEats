import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/server/auth/middleware/require-auth.middleware";
import { syncSupabaseUserToDatabase } from "@/server/auth/services/user-sync.service";
import { getOrderForUser } from "@/server/orders/services/order.service";
import { RetryPaymentButton } from "@/components/orders/retry-payment-button";
import { canRetryPayment, formatPaymentStatus, getPaymentStatusTone } from "@/lib/orders/payment-status";
import { formatMoney } from "@/lib/format-money";

type PageProps = {
  params: Promise<{ orderId: string }>;
};

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: PageProps) {
  const authUser = await requireAuth("/orders");
  const appUser = await syncSupabaseUserToDatabase(authUser);
  const { orderId } = await params;
  const order = await getOrderForUser(appUser.id, orderId);

  if (!order) notFound();

  return (
    <main className="min-h-[75vh] px-4 py-20">
      <section className="mx-auto max-w-3xl">
        <Link href="/orders" className="mb-8 inline-flex text-sm uppercase tracking-widest text-brown-500 hover:text-orange-600">
          Back to orders
        </Link>
        <div className="bg-brown-50 p-8 sm:p-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-orange-500">
            {order.status}
          </p>
          <h1 className="mb-2 font-display text-4xl font-bold text-brown-900">
            Order #{order.id.slice(-8)}
          </h1>
          <p className="mb-8 text-sm text-brown-400">{new Date(order.createdAt).toLocaleString()}</p>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 border-b border-brown-100 pb-4 text-sm">
                <span className="text-brown-700">{item.quantity} x {item.name}</span>
                <span className="font-semibold text-brown-900">{formatMoney(item.lineTotal, order.currency)}</span>
              </div>
            ))}
          </div>

          <dl className="mt-8 space-y-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(order.subtotal, order.currency)}</dd></div>
            <div className="flex justify-between"><dt>Tax</dt><dd>{formatMoney(order.tax, order.currency)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{formatMoney(order.deliveryFee, order.currency)}</dd></div>
            <div className="flex justify-between"><dt>Payment method</dt><dd>{order.paymentMethod === "PAY_ON_DELIVERY" ? "Pay on delivery" : "Pay now"}</dd></div>
            <div className="flex justify-between"><dt>Payment status</dt><dd className={getPaymentStatusTone(order.paymentStatus)}>{formatPaymentStatus(order.paymentStatus)}</dd></div>
            <div className="flex justify-between"><dt>Currency</dt><dd className="uppercase">{order.currency}</dd></div>
            {order.paidAt ? (
              <div className="flex justify-between"><dt>Paid at</dt><dd>{new Date(order.paidAt).toLocaleString()}</dd></div>
            ) : null}
            <div className="flex justify-between border-t border-brown-100 pt-4 text-xl font-bold text-brown-900">
              <dt>Total</dt><dd>{formatMoney(order.total, order.currency)}</dd>
            </div>
          </dl>

          {order.paymentMethod === "STRIPE" && canRetryPayment(order.paymentStatus) ? <RetryPaymentButton orderId={order.id} /> : null}
        </div>
      </section>
    </main>
  );
}
