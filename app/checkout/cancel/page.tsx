import Link from "next/link";

type PageProps = {
  searchParams: Promise<{ order_id?: string }>;
};

export default async function CheckoutCancelPage({ searchParams }: PageProps) {
  const { order_id: orderId } = await searchParams;

  return (
    <main className="min-h-[70vh] px-4 py-20">
      <section className="mx-auto max-w-2xl bg-brown-50 p-8 sm:p-10">
        <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-red-600">Payment incomplete</p>
        <h1 className="mb-4 font-display text-4xl font-bold text-brown-900">Checkout was canceled</h1>
        <p className="text-sm text-brown-600">
          Your order is saved. You can retry payment from your order details whenever you are ready.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {orderId ? (
            <Link
              href={`/orders/${orderId}`}
              className="inline-flex items-center justify-center bg-brown-900 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-orange-600"
            >
              Retry from order
            </Link>
          ) : null}
          <Link
            href="/orders"
            className="inline-flex items-center justify-center border border-brown-300 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-brown-900 transition-colors hover:border-orange-500 hover:text-orange-600"
          >
            Go to orders
          </Link>
        </div>
      </section>
    </main>
  );
}
