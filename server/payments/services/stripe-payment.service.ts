import "server-only";

import type Stripe from "stripe";
import { getPrisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";
import { getSiteUrl } from "@/lib/supabase/env";
import { createOrderFromActiveCart } from "@/server/orders/services/order.service";
import { getStripeAccountSettings } from "@/server/payments/services/stripe-account.service";

function toNumber(value: { toNumber?: () => number } | number) {
  return typeof value === "number" ? value : value.toNumber?.() ?? Number(value);
}

function toStripeAmount(value: { toNumber?: () => number } | number) {
  return Math.round(toNumber(value) * 100);
}

function fromStripeAmount(value: number) {
  return Math.round(value) / 100;
}

function resolveOrderIdFromSession(session: Stripe.Checkout.Session) {
  const metadataOrderId = session.metadata?.orderId;
  if (metadataOrderId) return metadataOrderId;

  const clientReferenceId = session.client_reference_id;
  if (typeof clientReferenceId === "string" && clientReferenceId.length > 0) {
    return clientReferenceId;
  }

  return null;
}

export async function createStripeCheckoutForNewOrder(
  userId: string,
  input: Parameters<typeof createOrderFromActiveCart>[1]
) {
  const order = await createOrderFromActiveCart(userId, input);
  if (!order) {
    throw new Error("Unable to create order.");
  }

  const checkout = await createStripeCheckoutForExistingOrder(userId, order.id);
  return { order, checkoutUrl: checkout.checkoutUrl, sessionId: checkout.sessionId };
}

export async function createStripeCheckoutForExistingOrder(userId: string, orderId: string) {
  const prisma = getPrisma();
  const stripe = getStripeClient();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.paymentStatus === "SUCCEEDED") {
    throw new Error("This order has already been paid.");
  }

  if (order.items.length === 0) {
    throw new Error("Order has no items.");
  }

  const siteUrl = getSiteUrl();
  const stripeSettings = await getStripeAccountSettings();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: order.id,
    customer_email: order.customerEmail,
    automatic_tax: {
      enabled: true,
    },
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: [stripeSettings.country as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry],
    },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
    cancel_url: `${siteUrl}/checkout/cancel?order_id=${order.id}`,
    metadata: {
      orderId: order.id,
      userId,
    },
    line_items: [
      ...order.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: order.currency,
          unit_amount: toStripeAmount(item.unitPrice),
          product_data: {
            name: item.name,
          },
        },
      })),
      ...(toNumber(order.deliveryFee) > 0
        ? [
            {
              quantity: 1,
              price_data: {
                currency: order.currency,
                unit_amount: toStripeAmount(order.deliveryFee),
                product_data: {
                  name: "Delivery",
                },
              },
            },
          ]
        : []),
    ],
  });

  if (!session.url) {
    throw new Error("Stripe checkout session URL was not returned.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PROCESSING",
        stripeCheckoutSessionId: session.id,
      },
    });

    await tx.payment.create({
      data: {
        orderId: order.id,
        userId,
        provider: "STRIPE",
        status: "PROCESSING",
        amount: order.total,
        currency: order.currency,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : null,
      },
    });
  });

  return {
    sessionId: session.id,
    checkoutUrl: session.url,
  };
}

export async function verifyAndParseStripeWebhook(rawBody: string, signature: string | null) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is required.");
  }

  if (!signature) {
    throw new Error("Missing Stripe webhook signature.");
  }

  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
      await markOrderFromCheckoutSession(event.data.object as Stripe.Checkout.Session);
      return;
    case "checkout.session.expired":
      await markOrderCanceledFromCheckoutSession(event.data.object as Stripe.Checkout.Session);
      return;
    case "payment_intent.succeeded":
      await markOrderPaidFromPaymentIntent(event.data.object as Stripe.PaymentIntent);
      return;
    case "payment_intent.payment_failed":
      await markOrderFailedFromPaymentIntent(event.data.object as Stripe.PaymentIntent);
      return;
    case "charge.refunded":
      await markOrderRefundedFromCharge(event.data.object as Stripe.Charge);
      return;
    default:
      return;
  }
}

export async function syncStripeCheckoutSessionForOrder(
  userId: string,
  orderId: string,
  checkoutSessionId: string
) {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);

  if (resolveOrderIdFromSession(session) !== orderId || session.metadata?.userId !== userId) {
    throw new Error("Checkout session does not match this order.");
  }

  await markOrderFromCheckoutSession(session);
}

async function syncCheckoutSessionForPaymentIntent(intent: Stripe.PaymentIntent) {
  const stripe = getStripeClient();
  const sessions = await stripe.checkout.sessions.list({
    payment_intent: intent.id,
    limit: 1,
  });
  const session = sessions.data[0];

  if (session) {
    await markOrderFromCheckoutSession(session);
  }
}

async function markOrderFromCheckoutSession(session: Stripe.Checkout.Session) {
  const prisma = getPrisma();
  const orderId = resolveOrderIdFromSession(session);
  if (!orderId) return;

  const isPaid = session.payment_status === "paid";
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;
  const tax = session.total_details?.amount_tax;
  const total = session.amount_total;

  if (tax === null || tax === undefined || total === null || total === undefined) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.updateMany({
      where: { id: orderId },
      data: {
        paymentStatus: isPaid ? "SUCCEEDED" : "PROCESSING",
        paidAt: isPaid ? new Date() : null,
        status: isPaid ? "CONFIRMED" : undefined,
        tax: fromStripeAmount(tax),
        total: fromStripeAmount(total),
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
      },
    });

    await tx.payment.updateMany({
      where: { stripeCheckoutSessionId: session.id },
      data: {
        status: isPaid ? "SUCCEEDED" : "PROCESSING",
        amount: fromStripeAmount(total),
        paidAt: isPaid ? new Date() : null,
        stripePaymentIntentId: paymentIntentId,
      },
    });
  });
}

async function markOrderCanceledFromCheckoutSession(session: Stripe.Checkout.Session) {
  const prisma = getPrisma();
  const orderId = resolveOrderIdFromSession(session);
  if (!orderId) return;

  await prisma.$transaction(async (tx) => {
    await tx.order.updateMany({
      where: { id: orderId, paymentStatus: { not: "SUCCEEDED" } },
      data: {
        paymentStatus: "CANCELED",
        stripeCheckoutSessionId: session.id,
      },
    });

    await tx.payment.updateMany({
      where: { stripeCheckoutSessionId: session.id, status: { not: "SUCCEEDED" } },
      data: {
        status: "CANCELED",
      },
    });
  });
}

async function markOrderPaidFromPaymentIntent(intent: Stripe.PaymentIntent) {
  await syncCheckoutSessionForPaymentIntent(intent);

  const prisma = getPrisma();
  const checkoutSessionId =
    typeof intent.metadata?.checkout_session_id === "string"
      ? intent.metadata.checkout_session_id
      : null;

  const orderWhereOr: Array<{ stripePaymentIntentId?: string; stripeCheckoutSessionId?: string }> = [
    { stripePaymentIntentId: intent.id },
  ];
  const paymentWhereOr: Array<{ stripePaymentIntentId?: string; stripeCheckoutSessionId?: string }> = [
    { stripePaymentIntentId: intent.id },
  ];

  if (checkoutSessionId) {
    orderWhereOr.push({ stripeCheckoutSessionId: checkoutSessionId });
    paymentWhereOr.push({ stripeCheckoutSessionId: checkoutSessionId });
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.updateMany({
      where: {
        OR: orderWhereOr,
      },
      data: {
        paymentStatus: "SUCCEEDED",
        paidAt: new Date(),
        status: "CONFIRMED",
        stripePaymentIntentId: intent.id,
      },
    });

    await tx.payment.updateMany({
      where: {
        OR: paymentWhereOr,
      },
      data: {
        status: "SUCCEEDED",
        paidAt: new Date(),
        stripePaymentIntentId: intent.id,
      },
    });
  });
}

async function markOrderFailedFromPaymentIntent(intent: Stripe.PaymentIntent) {
  const prisma = getPrisma();

  await prisma.$transaction(async (tx) => {
    await tx.order.updateMany({
      where: { stripePaymentIntentId: intent.id, paymentStatus: { not: "SUCCEEDED" } },
      data: {
        paymentStatus: "FAILED",
      },
    });

    await tx.payment.updateMany({
      where: { stripePaymentIntentId: intent.id, status: { not: "SUCCEEDED" } },
      data: {
        status: "FAILED",
        failureCode: intent.last_payment_error?.code ?? null,
        failureMessage: intent.last_payment_error?.message ?? null,
      },
    });
  });
}

async function markOrderRefundedFromCharge(charge: Stripe.Charge) {
  if (!charge.payment_intent || typeof charge.payment_intent !== "string") {
    return;
  }

  const paymentIntentId = charge.payment_intent;

  const prisma = getPrisma();
  await prisma.$transaction(async (tx) => {
    await tx.order.updateMany({
      where: { stripePaymentIntentId: paymentIntentId },
      data: {
        paymentStatus: "REFUNDED",
      },
    });

    await tx.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntentId },
      data: {
        status: "REFUNDED",
        refundedAt: new Date(),
      },
    });
  });
}
