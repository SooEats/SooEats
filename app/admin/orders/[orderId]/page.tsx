import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatusAction } from "@/app/admin/actions";
import {
  getAllowedOrderTransitions,
  getOrderForAdmin,
} from "@/server/orders/services/order-admin.service";
import { formatAdminDateTime } from "@/lib/admin-date-time";
import { formatMoney } from "@/lib/format-money";
import { formatPaymentStatus, getPaymentStatusTone } from "@/lib/orders/payment-status";

type Props = { params: Promise<{ orderId: string }> };

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  const order = await getOrderForAdmin(orderId);
  if (!order) notFound();
  const transitions = getAllowedOrderTransitions(order.status);

  return (
    <section className="max-w-5xl">
      <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-orange-600">Back to orders</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-brown-400">{formatAdminDateTime(order.createdAt)}</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Order #{order.id.slice(-8)}</h1>
        </div>
        <div className="text-right">
          <p className="font-bold text-orange-600">{order.status}</p>
          <p className={getPaymentStatusTone(order.paymentStatus)}>{formatPaymentStatus(order.paymentStatus)}</p>
        </div>
      </div>

      {transitions.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-3 border border-brown-100 bg-white p-5 shadow-sm">
          <span className="mr-2 self-center text-xs font-bold uppercase tracking-widest text-brown-400">Update status</span>
          {transitions.map((status) => (
            <form action={updateOrderStatusAction} key={status}>
              <input type="hidden" name="id" value={order.id} />
              <input type="hidden" name="status" value={status} />
              <button className={`px-5 py-2 text-xs font-bold uppercase tracking-widest text-white ${status === "CANCELLED" ? "bg-red-600 hover:bg-red-700" : "bg-brown-900 hover:bg-orange-600"}`}>
                Mark {status.toLowerCase()}
              </button>
            </form>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="border border-brown-100 bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold">Items</h2>
          <div className="mt-5 divide-y divide-brown-100">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 py-4 text-sm">
                <span>{item.quantity} x {item.name}</span>
                <span className="font-bold">{formatMoney(Number(item.lineTotal), order.currency)}</span>
              </div>
            ))}
          </div>
          <dl className="mt-5 space-y-3 border-t border-brown-100 pt-5 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMoney(Number(order.subtotal), order.currency)}</dd></div>
            <div className="flex justify-between"><dt>Tax</dt><dd>{formatMoney(Number(order.tax), order.currency)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{formatMoney(Number(order.deliveryFee), order.currency)}</dd></div>
            <div className="flex justify-between text-xl font-bold"><dt>Total</dt><dd>{formatMoney(Number(order.total), order.currency)}</dd></div>
          </dl>
        </div>

        <div className="space-y-6">
          <div className="border border-brown-100 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold">Customer</h2>
            <div className="mt-4 space-y-2 text-sm">
              <p className="font-semibold">{order.customerName}</p>
              <p className="break-all text-brown-500">{order.customerEmail}</p>
              <p className="text-brown-500">{order.customerPhone || "No phone provided"}</p>
            </div>
          </div>

          <div className="border border-brown-100 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold">Delivery</h2>
            {order.address ? (
              <address className="mt-4 not-italic text-sm leading-6 text-brown-500">
                {order.address.line1}<br />
                {order.address.line2 ? <>{order.address.line2}<br /></> : null}
                {order.address.city}, {order.address.state} {order.address.postalCode}<br />
                {order.address.country}
              </address>
            ) : <p className="mt-4 text-sm text-brown-400">No delivery address.</p>}
            {order.notes ? <p className="mt-4 border-t border-brown-100 pt-4 text-sm text-brown-500">Notes: {order.notes}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
