import { NextResponse } from "next/server";
import { getCurrentAppUser } from "@/server/auth/services/current-app-user.service";
import { listOrdersForUser } from "@/server/orders/services/order.service";
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
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    notes?: string;
    address?: {
      label?: string;
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  } | null;

  if (!body?.customerName || !body.customerEmail) {
    return NextResponse.json(
      { error: "customerName and customerEmail are required" },
      { status: 400 }
    );
  }

  const address =
    body.address?.line1 && body.address.city && body.address.state && body.address.postalCode
      ? {
          label: body.address.label,
          line1: body.address.line1,
          line2: body.address.line2,
          city: body.address.city,
          state: body.address.state,
          postalCode: body.address.postalCode,
          country: body.address.country,
        }
      : undefined;

  try {
    const checkout = await createStripeCheckoutForNewOrder(user.id, {
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      notes: body.notes,
      address,
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
