import "server-only";

import { getStripeClient } from "@/lib/stripe";

type StripeAccountSettings = {
  country: string;
  currency: string;
};

let cachedAccountSettings: StripeAccountSettings | null = null;

export async function getStripeAccountSettings() {
  if (cachedAccountSettings) return cachedAccountSettings;

  const stripe = getStripeClient();
  const account = await stripe.accounts.retrieveCurrent();

  if (!account.country || !account.default_currency) {
    throw new Error("Stripe account country and default currency are required.");
  }

  cachedAccountSettings = {
    country: account.country.toUpperCase(),
    currency: account.default_currency.toLowerCase(),
  };

  return cachedAccountSettings;
}
