'use client';

import { useState } from 'react';

type RetryPaymentButtonProps = {
  orderId: string;
};

export function RetryPaymentButton({ orderId }: RetryPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRetry() {
    setError(null);
    setIsLoading(true);

    const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/checkout-session`, {
      method: 'POST',
    });

    const payload = (await response.json().catch(() => null)) as
      | { checkoutUrl?: string; error?: string }
      | null;

    setIsLoading(false);

    if (!response.ok || !payload?.checkoutUrl) {
      setError(payload?.error || 'Unable to start payment.');
      return;
    }

    window.location.assign(payload.checkoutUrl);
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleRetry}
        disabled={isLoading}
        className="inline-flex items-center justify-center bg-brown-900 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Redirecting...' : 'Retry payment'}
      </button>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
