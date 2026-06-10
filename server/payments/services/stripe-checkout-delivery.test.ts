import type Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { getStripeCheckoutDeliveryDetails } from "./stripe-checkout-delivery";

function checkoutSession(
  value: Partial<Pick<Stripe.Checkout.Session, "collected_information" | "customer_details">>
) {
  return {
    collected_information: null,
    customer_details: null,
    ...value,
  };
}

describe("getStripeCheckoutDeliveryDetails", () => {
  it("returns the collected phone and shipping address", () => {
    const address = {
      city: "Sault Ste. Marie",
      country: "CA",
      line1: "123 Example Street",
      line2: null,
      postal_code: "P6A 1A1",
      state: "ON",
    };

    const details = getStripeCheckoutDeliveryDetails(
      checkoutSession({
        customer_details: {
          address: null,
          business_name: null,
          email: "customer@example.com",
          individual_name: null,
          name: "Customer",
          phone: " 705-555-0100 ",
          tax_exempt: "none",
          tax_ids: [],
        },
        collected_information: {
          business_name: null,
          individual_name: null,
          shipping_details: {
            address,
            name: "Customer",
          },
        },
      })
    );

    expect(details.customerPhone).toBe("705-555-0100");
    expect(details.shippingAddress).toBe(address);
  });

  it("falls back to the customer address when shipping details are absent", () => {
    const address = {
      city: "Sault Ste. Marie",
      country: "CA",
      line1: "123 Example Street",
      line2: null,
      postal_code: "P6A 1A1",
      state: "ON",
    };

    const details = getStripeCheckoutDeliveryDetails(
      checkoutSession({
        customer_details: {
          address,
          business_name: null,
          email: "customer@example.com",
          individual_name: null,
          name: "Customer",
          phone: null,
          tax_exempt: "none",
          tax_ids: [],
        },
      })
    );

    expect(details.customerPhone).toBeUndefined();
    expect(details.shippingAddress).toBe(address);
  });
});
