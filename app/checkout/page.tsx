'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        customerPhone: formData.get('customerPhone'),
        notes: formData.get('notes'),
        address: {
          line1: formData.get('line1'),
          line2: formData.get('line2'),
          city: formData.get('city'),
          state: formData.get('state'),
          postalCode: formData.get('postalCode'),
          country: formData.get('country') || 'US',
        },
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { order?: { id: string }; checkoutUrl?: string | null; error?: string }
      | null;

    setIsSubmitting(false);

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

  return (
    <main className="min-h-[75vh] px-4 py-20">
      <section className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="bg-brown-50 p-8 sm:p-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-orange-500">
            Checkout
          </p>
          <h1 className="mb-8 font-display text-4xl font-bold text-brown-900">
            Delivery details
          </h1>

          <div className="grid gap-5 sm:grid-cols-2">
            <input name="customerName" required placeholder="Name" className="px-4 py-3 text-sm" />
            <input name="customerEmail" type="email" required placeholder="Email" className="px-4 py-3 text-sm" />
            <input name="customerPhone" placeholder="Phone" className="px-4 py-3 text-sm sm:col-span-2" />
            <input name="line1" required placeholder="Address line 1" className="px-4 py-3 text-sm sm:col-span-2" />
            <input name="line2" placeholder="Address line 2" className="px-4 py-3 text-sm sm:col-span-2" />
            <input name="city" required placeholder="City" className="px-4 py-3 text-sm" />
            <input name="state" required placeholder="State" className="px-4 py-3 text-sm" />
            <input name="postalCode" required placeholder="Postal code" className="px-4 py-3 text-sm" />
            <input name="country" defaultValue="US" placeholder="Country" className="px-4 py-3 text-sm" />
            <textarea name="notes" placeholder="Notes" className="min-h-28 px-4 py-3 text-sm sm:col-span-2" />
          </div>

          {error && <p className="mt-5 text-sm font-medium text-red-600">{error}</p>}

          <Button
            type="submit"
            disabled={items.length === 0 || isSubmitting}
            className="mt-8 w-full bg-brown-900 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Redirecting to payment...' : 'Pay now'}
          </Button>
        </form>

        <aside className="h-fit border border-brown-100 p-6">
          <h2 className="mb-5 font-display text-2xl font-bold text-brown-900">Order summary</h2>
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
                Tax and delivery are calculated when the order is created.
              </div>
              <div className="flex justify-between text-xl font-bold text-brown-900">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
