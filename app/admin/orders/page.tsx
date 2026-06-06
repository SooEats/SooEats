import Link from "next/link";
import { listOrdersForAdmin } from "@/server/orders/services/order-admin.service";
import { formatMoney } from "@/lib/format-money";
import { formatPaymentStatus, getPaymentStatusTone } from "@/lib/orders/payment-status";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await listOrdersForAdmin();

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">Operations</p>
      <h1 className="mt-3 font-display text-4xl font-bold">Customer orders</h1>

      <div className="mt-8 overflow-x-auto border border-brown-100 bg-white shadow-sm">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="border-b border-brown-100 bg-brown-50 text-[11px] uppercase tracking-widest text-brown-500">
            <tr>
              <th className="px-5 py-4">Order</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Payment</th>
              <th className="px-5 py-4">Items</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brown-100">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-5 py-4">
                  <p className="font-semibold">#{order.id.slice(-8)}</p>
                  <p className="text-xs text-brown-400">{new Date(order.createdAt).toLocaleString()}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-xs text-brown-400">{order.customerEmail}</p>
                </td>
                <td className="px-5 py-4 font-bold text-orange-600">{order.status}</td>
                <td className={`px-5 py-4 ${getPaymentStatusTone(order.paymentStatus)}`}>
                  {formatPaymentStatus(order.paymentStatus)}
                </td>
                <td className="px-5 py-4">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td className="px-5 py-4 font-bold">{formatMoney(Number(order.total), order.currency)}</td>
                <td className="px-5 py-4">
                  <Link href={`/admin/orders/${order.id}`} className="font-semibold text-orange-600 hover:text-brown-900">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 ? <p className="p-8 text-sm text-brown-400">No orders yet.</p> : null}
      </div>
    </section>
  );
}
