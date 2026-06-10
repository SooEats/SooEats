import type Stripe from "stripe";

type CheckoutDeliverySession = Pick<
  Stripe.Checkout.Session,
  "collected_information" | "customer_details"
>;

export function getStripeCheckoutDeliveryDetails(session: CheckoutDeliverySession) {
  return {
    customerPhone: session.customer_details?.phone?.trim() || undefined,
    shippingAddress:
      session.collected_information?.shipping_details?.address ??
      session.customer_details?.address ??
      undefined,
  };
}
