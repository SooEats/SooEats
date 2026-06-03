'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';

type PaymentMethod = 'STRIPE' | 'PAY_ON_DELIVERY';

type DeliveryForm = {
  customerName: string;
  customerPhone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  notes: string;
};

const emptyDeliveryForm: DeliveryForm = {
  customerName: '',
  customerPhone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  notes: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [submittingMethod, setSubmittingMethod] = useState<PaymentMethod | null>(null);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>(emptyDeliveryForm);

  function updateDeliveryField(field: keyof DeliveryForm, value: string) {
    setDeliveryForm((current) => ({ ...current, [field]: value }));
  }

  async function createOrder(paymentMethod: PaymentMethod, deliveryDetails?: DeliveryForm) {
    setError(null);
    setSubmittingMethod(paymentMethod);

    const body =
      paymentMethod === 'PAY_ON_DELIVERY' && deliveryDetails
        ? {
            paymentMethod,
            customerName: deliveryDetails.customerName,
            customerPhone: deliveryDetails.customerPhone,
            notes: deliveryDetails.notes,
            address: {
              line1: deliveryDetails.line1,
              line2: deliveryDetails.line2,
              city: deliveryDetails.city,
              state: deliveryDetails.state,
              postalCode: deliveryDetails.postalCode,
            },
          }
        : { paymentMethod };

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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

    if (paymentMethod === 'PAY_ON_DELIVERY') {
      await clearCart();
    }

    router.push(`/orders/${payload.order.id}`);
  }

  function revealDeliveryForm() {
    setError(null);
    setShowDeliveryForm(true);
  }

  function confirmPayOnDelivery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedDetails: DeliveryForm = {
      customerName: deliveryForm.customerName.trim(),
      customerPhone: deliveryForm.customerPhone.trim(),
      line1: deliveryForm.line1.trim(),
      line2: deliveryForm.line2.trim(),
      city: deliveryForm.city.trim(),
      state: deliveryForm.state.trim(),
      postalCode: deliveryForm.postalCode.trim(),
      notes: deliveryForm.notes.trim(),
    };

    if (
      !trimmedDetails.customerName ||
      !trimmedDetails.customerPhone ||
      !trimmedDetails.line1 ||
      !trimmedDetails.city ||
      !trimmedDetails.state ||
      !trimmedDetails.postalCode
    ) {
      setError('Please add your name, phone number, and delivery address.');
      return;
    }

    void createOrder('PAY_ON_DELIVERY', trimmedDetails);
  }

  const isPayNowSubmitting = submittingMethod === 'STRIPE';
  const isPayOnDeliverySubmitting = submittingMethod === 'PAY_ON_DELIVERY';
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

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="ghost"
              disabled={items.length === 0 || isSubmitting}
              aria-busy={isPayNowSubmitting}
              onClick={() => createOrder('STRIPE')}
              className="w-full rounded-none border border-brown-900 bg-brown-900 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-sm hover:border-orange-600 hover:bg-orange-600 hover:text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CreditCard className="mr-2 h-4 w-4" aria-hidden="true" />
              {isPayNowSubmitting ? 'Redirecting...' : 'Pay now'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={items.length === 0 || isSubmitting}
              onClick={revealDeliveryForm}
              className="w-full border border-brown-300 bg-white px-8 py-4 text-sm font-semibold uppercase tracking-widest text-brown-900 hover:border-orange-500 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Pay on delivery
            </Button>
          </div>

          {showDeliveryForm && (
            <form onSubmit={confirmPayOnDelivery} className="mt-8 border-t border-brown-100 pt-8">
              <h2 className="font-display text-2xl font-bold text-brown-900">
                Delivery details
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-brown-700">
                  Name
                  <input
                    required
                    type="text"
                    value={deliveryForm.customerName}
                    onChange={(event) => updateDeliveryField('customerName', event.target.value)}
                    className="mt-2 w-full border border-brown-200 bg-white px-4 py-3 text-sm text-brown-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </label>
                <label className="block text-sm font-medium text-brown-700">
                  Phone
                  <input
                    required
                    type="tel"
                    value={deliveryForm.customerPhone}
                    onChange={(event) => updateDeliveryField('customerPhone', event.target.value)}
                    className="mt-2 w-full border border-brown-200 bg-white px-4 py-3 text-sm text-brown-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </label>
                <label className="block text-sm font-medium text-brown-700 sm:col-span-2">
                  Address
                  <input
                    required
                    type="text"
                    value={deliveryForm.line1}
                    onChange={(event) => updateDeliveryField('line1', event.target.value)}
                    className="mt-2 w-full border border-brown-200 bg-white px-4 py-3 text-sm text-brown-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </label>
                <label className="block text-sm font-medium text-brown-700 sm:col-span-2">
                  Apartment, suite, or landmark
                  <input
                    type="text"
                    value={deliveryForm.line2}
                    onChange={(event) => updateDeliveryField('line2', event.target.value)}
                    className="mt-2 w-full border border-brown-200 bg-white px-4 py-3 text-sm text-brown-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </label>
                <label className="block text-sm font-medium text-brown-700">
                  City
                  <input
                    required
                    type="text"
                    value={deliveryForm.city}
                    onChange={(event) => updateDeliveryField('city', event.target.value)}
                    className="mt-2 w-full border border-brown-200 bg-white px-4 py-3 text-sm text-brown-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </label>
                <label className="block text-sm font-medium text-brown-700">
                  State
                  <input
                    required
                    type="text"
                    value={deliveryForm.state}
                    onChange={(event) => updateDeliveryField('state', event.target.value)}
                    className="mt-2 w-full border border-brown-200 bg-white px-4 py-3 text-sm text-brown-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </label>
                <label className="block text-sm font-medium text-brown-700">
                  Postal code
                  <input
                    required
                    type="text"
                    value={deliveryForm.postalCode}
                    onChange={(event) => updateDeliveryField('postalCode', event.target.value)}
                    className="mt-2 w-full border border-brown-200 bg-white px-4 py-3 text-sm text-brown-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </label>
                <label className="block text-sm font-medium text-brown-700 sm:col-span-2">
                  Order notes
                  <textarea
                    rows={3}
                    value={deliveryForm.notes}
                    onChange={(event) => updateDeliveryField('notes', event.target.value)}
                    className="mt-2 w-full resize-none border border-brown-200 bg-white px-4 py-3 text-sm text-brown-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </label>
              </div>
              <Button
                type="submit"
                variant="ghost"
                disabled={items.length === 0 || isSubmitting}
                aria-busy={isPayOnDeliverySubmitting}
                className="mt-6 w-full rounded-none bg-orange-600 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white hover:bg-brown-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPayOnDeliverySubmitting ? 'Confirming...' : 'Confirm order'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
