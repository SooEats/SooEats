import "server-only";

import Stripe from "stripe";

const globalForStripe = globalThis as unknown as {
  stripe?: Stripe;
};

function createStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is required.");
  }

  return new Stripe(secretKey);
}

export function getStripeClient() {
  const stripe = globalForStripe.stripe ?? createStripeClient();

  if (process.env.NODE_ENV !== "production") {
    globalForStripe.stripe = stripe;
  }

  return stripe;
}
