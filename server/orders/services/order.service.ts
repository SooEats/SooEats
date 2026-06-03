import "server-only";

import { getPrisma } from "@/lib/prisma";
import { getCartRepository } from "@/server/cart/repositories/cart.repository";
import { getOrderRepository } from "@/server/orders/repositories/order.repository";
import { getStripeAccountSettings } from "@/server/payments/services/stripe-account.service";

const DELIVERY_FEE = 0;

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
  paymentMethod?: "STRIPE" | "PAY_ON_DELIVERY";
  address?: {
    label?: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
};

function toNumber(value: { toNumber?: () => number } | number) {
  return typeof value === "number" ? value : value.toNumber?.() ?? Number(value);
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function serializeOrder(order: Awaited<ReturnType<ReturnType<typeof getOrderRepository>["findForUser"]>>) {
  if (!order) return null;

  const latestPayment = order.payments[0] ?? null;

  return {
    id: order.id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    currency: order.currency,
    subtotal: toNumber(order.subtotal),
    tax: toNumber(order.tax),
    deliveryFee: toNumber(order.deliveryFee),
    total: toNumber(order.total),
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    notes: order.notes,
    paidAt: order.paidAt?.toISOString() ?? null,
    stripeCheckoutSessionId: order.stripeCheckoutSessionId,
    stripePaymentIntentId: order.stripePaymentIntentId,
    createdAt: order.createdAt.toISOString(),
    address: order.address,
    payment: latestPayment
      ? {
          id: latestPayment.id,
          provider: latestPayment.provider,
          status: latestPayment.status,
          amount: toNumber(latestPayment.amount),
          currency: latestPayment.currency,
          stripeCheckoutSessionId: latestPayment.stripeCheckoutSessionId,
          stripePaymentIntentId: latestPayment.stripePaymentIntentId,
          failureCode: latestPayment.failureCode,
          failureMessage: latestPayment.failureMessage,
          paidAt: latestPayment.paidAt?.toISOString() ?? null,
          refundedAt: latestPayment.refundedAt?.toISOString() ?? null,
          createdAt: latestPayment.createdAt.toISOString(),
        }
      : null,
    items: order.items.map((item) => ({
      id: item.id,
      menuItemId: item.menuItemId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: toNumber(item.unitPrice),
      lineTotal: toNumber(item.lineTotal),
    })),
  };
}

export async function listOrdersForUser(userId: string) {
  const orders = await getOrderRepository().listForUser(userId);
  return orders.map(serializeOrder).filter((order) => order !== null);
}

export async function getOrderForUser(userId: string, orderId: string) {
  return serializeOrder(await getOrderRepository().findForUser(userId, orderId));
}

export async function createOrderFromActiveCart(userId: string, input: CreateOrderInput) {
  const prisma = getPrisma();
  const stripeSettings = await getStripeAccountSettings();
  const cart = await getCartRepository().findActiveCart(userId);

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const subtotal = roundMoney(
    cart.items.reduce((sum, item) => sum + toNumber(item.unitPrice) * item.quantity, 0)
  );
  const tax = 0;
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = roundMoney(subtotal + tax + deliveryFee);
  const paymentMethod = input.paymentMethod ?? "STRIPE";

  const order = await prisma.$transaction(async (tx) => {
    const address = input.address
      ? await tx.address.create({
          data: {
            userId,
            label: input.address.label,
            line1: input.address.line1,
            line2: input.address.line2,
            city: input.address.city,
            state: input.address.state,
            postalCode: input.address.postalCode,
            country: input.address.country || stripeSettings.country,
          },
        })
      : null;

    const createdOrder = await tx.order.create({
      data: {
        userId,
        status: paymentMethod === "PAY_ON_DELIVERY" ? "CONFIRMED" : "PENDING",
        paymentStatus: "REQUIRES_PAYMENT",
        paymentMethod,
        currency: stripeSettings.currency,
        subtotal,
        tax,
        deliveryFee,
        total,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        notes: input.notes,
        addressId: address?.id,
        items: {
          create: cart.items.map((item) => {
            const unitPrice = toNumber(item.unitPrice);
            return {
              menuItemId: item.menuItemId,
              name: item.menuItem.name,
              quantity: item.quantity,
              unitPrice,
              lineTotal: roundMoney(unitPrice * item.quantity),
            };
          }),
        },
      },
      include: {
        items: true,
        address: true,
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    await tx.cart.update({
      where: { id: cart.id },
      data: { status: "CONVERTED" },
    });

    return createdOrder;
  });

  return serializeOrder(order);
}

export async function createPayOnDeliveryOrder(userId: string, input: Omit<CreateOrderInput, "paymentMethod">) {
  return createOrderFromActiveCart(userId, {
    ...input,
    paymentMethod: "PAY_ON_DELIVERY",
  });
}
