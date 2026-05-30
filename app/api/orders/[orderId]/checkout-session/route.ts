import { NextResponse } from "next/server";
import { getCurrentAppUser } from "@/server/auth/services/current-app-user.service";
import { createStripeCheckoutForExistingOrder } from "@/server/payments/services/stripe-payment.service";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const user = await getCurrentAppUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderId } = await context.params;

  try {
    const checkout = await createStripeCheckoutForExistingOrder(user.id, orderId);
    return NextResponse.json({
      checkoutUrl: checkout.checkoutUrl,
      checkoutSessionId: checkout.sessionId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create checkout session" },
      { status: 400 }
    );
  }
}
