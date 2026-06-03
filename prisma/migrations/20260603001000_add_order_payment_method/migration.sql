CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE', 'PAY_ON_DELIVERY');

ALTER TABLE "Order"
ADD COLUMN "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'STRIPE';

CREATE INDEX "Order_paymentMethod_idx" ON "Order"("paymentMethod");
