-- CreateEnum
CREATE TYPE "MenuCategory" AS ENUM ('BREAKFAST', 'LUNCH', 'DRINKS', 'DESSERT');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CONVERTED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "serving" TEXT NOT NULL,
    "category" "MenuCategory" NOT NULL,
    "calories" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "protein" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "carbs" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "fats" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL,
    "deliveryFee" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "addressId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "menuItemId" TEXT,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "lineTotal" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_slug_key" ON "MenuItem"("slug");

-- CreateIndex
CREATE INDEX "MenuItem_category_sortOrder_idx" ON "MenuItem"("category", "sortOrder");

-- CreateIndex
CREATE INDEX "MenuItem_isAvailable_idx" ON "MenuItem"("isAvailable");

-- CreateIndex
CREATE INDEX "Cart_userId_status_idx" ON "Cart"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_one_active_per_user_idx" ON "Cart"("userId") WHERE "status" = 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_menuItemId_key" ON "CartItem"("cartId", "menuItemId");

-- CreateIndex
CREATE INDEX "CartItem_menuItemId_idx" ON "CartItem"("menuItemId");

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "Address"("userId");

-- CreateIndex
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_menuItemId_idx" ON "OrderItem"("menuItemId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed current static menu items with stable slugs.
INSERT INTO "MenuItem" (
    "id", "slug", "name", "description", "price", "imageUrl", "serving", "category",
    "calories", "protein", "carbs", "fats", "isAvailable", "sortOrder", "updatedAt"
) VALUES
    ('menu_protein_pancakes', 'protein-pancakes', 'Protein Pancakes', 'Three fluffy high-protein pancakes served with fresh toppings', 12.99, '/menu/pancake.jpeg', '3 pancakes', 'BREAKFAST', 610, 40, 70, 19, true, 10, CURRENT_TIMESTAMP),
    ('menu_signature_protein_wrap', 'signature-protein-wrap', 'Signature Wrap', 'Four loaded wraps packed with protein and fresh vegetables', 14.99, '/menu/protein_wrap.jpeg', '4 wraps', 'LUNCH', 624, 45, 65, 18, true, 20, CURRENT_TIMESTAMP),
    ('menu_tandoori_wrap', 'tandoori-wrap', 'Tandoori Wrap', 'Four smoky tandoori-spiced wraps with fresh veggies and sauce', 14.99, 'https://picsum.photos/seed/tandoori-wrap/600/400', '4 wraps', 'LUNCH', 662, 46, 65, 16, true, 30, CURRENT_TIMESTAMP),
    ('menu_chicken_steak_rice', 'chicken-steak-rice', 'Chicken Steak & Rice', 'Grilled chicken steak served with seasoned rice', 16.99, '/menu/chicken_steak_rice.jpeg', 'Half breast & 300g rice', 'LUNCH', 820, 48, 105, 23, true, 40, CURRENT_TIMESTAMP),
    ('menu_protein_pasta', 'protein-pasta', 'Protein Pasta', 'High-protein pasta tossed in a signature sauce with fresh herbs', 13.99, '/menu/pasta.jpeg', '1 serving', 'LUNCH', 401.66, 30, 50, 6, true, 50, CURRENT_TIMESTAMP),
    ('menu_strawberry_protein_ice_cream', 'strawberry-protein-ice-cream', 'Strawberry Protein Ice-Cream', 'Luscious strawberry ice-cream packed with protein - 230ml serving', 8.99, '/menu/icecream-Strawberry.jpeg', '230ml', 'DESSERT', 278, 25, 16, 12, true, 60, CURRENT_TIMESTAMP),
    ('menu_blueberry_protein_ice_cream', 'blueberry-protein-ice-cream', 'Blueberry Protein Ice-Cream', 'Creamy blueberry ice-cream loaded with protein - 230ml serving', 8.99, '/menu/icecream-Blueberry.jpeg', '230ml', 'DESSERT', 283, 25, 18, 12, true, 70, CURRENT_TIMESTAMP),
    ('menu_protein_cheesecake', 'protein-cheesecake', 'Protein Cheesecake', 'Indulgent cheesecake with a protein-packed twist', 9.99, 'https://picsum.photos/seed/protein-cheesecake/600/400', '1 slice', 'DESSERT', 0, 0, 0, 0, true, 80, CURRENT_TIMESTAMP),
    ('menu_protein_coffee', 'protein-coffee', 'Protein Coffee', 'Rich coffee blended with protein for an energizing boost', 6.99, 'https://picsum.photos/seed/protein-coffee/600/400', '1 drink', 'DRINKS', 0, 0, 0, 0, true, 90, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO UPDATE SET
    "name" = EXCLUDED."name",
    "description" = EXCLUDED."description",
    "price" = EXCLUDED."price",
    "imageUrl" = EXCLUDED."imageUrl",
    "serving" = EXCLUDED."serving",
    "category" = EXCLUDED."category",
    "calories" = EXCLUDED."calories",
    "protein" = EXCLUDED."protein",
    "carbs" = EXCLUDED."carbs",
    "fats" = EXCLUDED."fats",
    "isAvailable" = EXCLUDED."isAvailable",
    "sortOrder" = EXCLUDED."sortOrder",
    "updatedAt" = CURRENT_TIMESTAMP;
