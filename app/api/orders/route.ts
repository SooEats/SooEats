import { NextResponse } from "next/server";
import { getCurrentAppUser } from "@/server/auth/services/current-app-user.service";
import { createPayOnDeliveryOrder, listOrdersForUser } from "@/server/orders/services/order.service";
import { createStripeCheckoutForNewOrder } from "@/server/payments/services/stripe-payment.service";

export async function GET() {
  const user = await getCurrentAppUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await listOrdersForUser(user.id);
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const user = await getCurrentAppUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    paymentMethod?: "STRIPE" | "PAY_ON_DELIVERY";
  } | null;

  const paymentMethod = body?.paymentMethod ?? "STRIPE";
  const customerName = user.name || user.email.split("@")[0] || "Customer";
  const customerEmail = user.email;

  if (paymentMethod !== "STRIPE" && paymentMethod !== "PAY_ON_DELIVERY") {
    return NextResponse.json(
      { error: "Invalid payment method" },
      { status: 400 }
    );
  }

  try {
    if (paymentMethod === "PAY_ON_DELIVERY") {
      const order = await createPayOnDeliveryOrder(user.id, {
        customerName,
        customerEmail,
      });

      return NextResponse.json({ order, checkoutUrl: null, checkoutSessionId: null }, { status: 201 });
    }

    const checkout = await createStripeCheckoutForNewOrder(user.id, {
      customerName,
      customerEmail,
      paymentMethod: "STRIPE",
    });

    return NextResponse.json(
      {
        order: checkout.order,
        checkoutUrl: checkout.checkoutUrl,
        checkoutSessionId: checkout.sessionId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create order" },
      { status: 400 }
    );
  }
}
