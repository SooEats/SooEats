import { NextResponse } from "next/server";
import {
  handleStripeWebhookEvent,
  verifyAndParseStripeWebhook,
} from "@/server/payments/services/stripe-payment.service";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    const event = await verifyAndParseStripeWebhook(rawBody, signature);
    await handleStripeWebhookEvent(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook" },
      { status: 400 }
    );
  }
}
