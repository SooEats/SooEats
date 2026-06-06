ALTER TABLE "MenuItem"
ADD COLUMN "stockQuantity" INTEGER,
ADD COLUMN "archivedAt" TIMESTAMP(3);

ALTER TABLE "Order"
ADD COLUMN "inventoryRestoredAt" TIMESTAMP(3);

CREATE INDEX "MenuItem_archivedAt_idx" ON "MenuItem"("archivedAt");

ALTER TABLE "MenuItem"
ADD CONSTRAINT "MenuItem_stockQuantity_check"
CHECK ("stockQuantity" IS NULL OR "stockQuantity" >= 0);
