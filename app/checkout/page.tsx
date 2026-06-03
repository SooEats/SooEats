'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

type PaymentMethod = 'STRIPE' | 'PAY_ON_DELIVERY';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [submittingMethod, setSubmittingMethod] = useState<PaymentMethod | null>(null);

  async function createOrder(paymentMethod: PaymentMethod) {
    setError(null);
    setSubmittingMethod(paymentMethod);

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { order?: { id: string }; checkoutUrl?: string | null; error?: string }
      | null;

    setSubmittingMethod(null);

    if (!response.ok || !payload?.order) {
      setError(payload?.error || 'Unable to create order.');
      return;
    }

    if (payload.checkoutUrl) {
      window.location.assign(payload.checkoutUrl);
      return;
    }

    router.push(`/orders/${payload.order.id}`);
  }

  const isPayNowSubmitting = submittingMethod === 'STRIPE';
  const isSubmitting = submittingMethod !== null;

  return (
    <main className="min-h-[75vh] px-4 py-20">
      <section className="mx-auto max-w-3xl">
        <div className="bg-brown-50 p-8 sm:p-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-orange-500">
            Checkout
          </p>
          <h1 className="mb-8 font-display text-4xl font-bold text-brown-900">
            Order summary
          </h1>

          {items.length === 0 ? (
            <p className="text-sm text-brown-400">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {items.map((cartItem) => (
                <div key={cartItem.item.id} className="flex justify-between gap-4 text-sm">
                  <span className="text-brown-700">
                    {cartItem.quantity} x {cartItem.item.name}
                  </span>
                  <span className="font-semibold text-brown-900">
                    ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-brown-100 pt-4 text-sm text-brown-500">
                Delivery is included before payment. Tax is calculated in Stripe Checkout for pay now orders.
              </div>
              <div className="flex justify-between text-xl font-bold text-brown-900">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          {error && <p className="mt-5 text-sm font-medium text-red-600">{error}</p>}

          <div className="mt-8">
            <button
              type="button"
              disabled={items.length === 0 || isSubmitting}
              aria-busy={isPayNowSubmitting}
              onClick={() => createOrder('STRIPE')}
              className="inline-flex h-14 w-full items-center justify-center border border-brown-900 bg-brown-900 px-8 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-sm transition-colors duration-200 hover:border-orange-600 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-brown-300 disabled:text-white/80 sm:max-w-md"
            >
              <CreditCard className="mr-2 h-4 w-4" aria-hidden="true" />
              {isPayNowSubmitting ? 'Redirecting...' : 'Pay now'}
            </button>

            {/*
            <button
              type="button"
              disabled={items.length === 0 || isSubmitting}
              onClick={() => createOrder('PAY_ON_DELIVERY')}
              className="w-full border border-brown-300 bg-white px-8 py-4 text-sm font-semibold uppercase tracking-widest text-brown-900 hover:border-orange-500 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Pay on delivery
            </button>
            */}
          </div>
        </div>
      </section>
    </main>
  );
}
