# Database Updates Plan

This app currently has only one app-owned database table: `User`.

Menu data is static in `lib/data/menu.ts`, and carts are stored in browser `localStorage`. To make the app production-ready, the database should own menu items, carts, orders, and related checkout data.

## Current State

Existing app table:

```txt
User
```

Missing app tables:

```txt
MenuItem
Cart
CartItem
Order
OrderItem
Address
```

Optional later tables:

```txt
Payment
Coupon
Review
Favorite
InventoryLog
```

## Phase 1: Menu Database

Add a `MenuItem` table so menu content can be managed from the database instead of hardcoded TypeScript.

Suggested fields:

```txt
id
slug
name
description
price
imageUrl
serving
category
calories
protein
carbs
fats
isAvailable
sortOrder
createdAt
updatedAt
```

Backend changes:

```txt
prisma/schema.prisma
server/menu/repositories/menu.repository.ts
server/menu/services/menu.service.ts
```

Frontend changes:

```txt
app/menu/page.tsx
app/nutrition/page.tsx
app/soo-eats/page.tsx
app/page.tsx
components/menu/*
components/nutrition/*
```

Implementation notes:

- Seed existing items from `lib/data/menu.ts`.
- Keep item IDs or slugs stable so cart/order references remain valid.
- Add an `isAvailable` flag instead of deleting menu items that may be referenced by old orders.

## Phase 2: Database Cart

Move cart state from `localStorage` into the database so carts persist across devices and browsers.

Suggested tables:

```txt
Cart
CartItem
```

Suggested `Cart` fields:

```txt
id
userId
status
createdAt
updatedAt
```

Suggested `CartItem` fields:

```txt
id
cartId
menuItemId
quantity
unitPrice
createdAt
updatedAt
```

Backend changes:

```txt
server/cart/repositories/cart.repository.ts
server/cart/services/cart.service.ts
app/api/cart/route.ts
app/api/cart/items/route.ts
app/api/cart/items/[itemId]/route.ts
```

Frontend changes:

```txt
lib/cart-context.tsx
components/cart/cart-sidebar.tsx
components/layout/navbar.tsx
app/menu/page.tsx
app/page.tsx
```

Implementation notes:

- Require auth for cart mutations.
- Use one active cart per user.
- Store `unitPrice` on `CartItem` so price changes do not silently alter an existing cart.
- Keep optimistic UI optional; correctness matters first.
- After database cart works, remove or reduce `localStorage` usage.

## Phase 3: Orders

Create order records from the active cart.

Suggested tables:

```txt
Order
OrderItem
Address
```

Suggested `Order` fields:

```txt
id
userId
status
subtotal
tax
deliveryFee
total
customerName
customerEmail
customerPhone
addressId
notes
createdAt
updatedAt
```

Suggested `OrderItem` fields:

```txt
id
orderId
menuItemId
name
quantity
unitPrice
lineTotal
createdAt
updatedAt
```

Suggested `Address` fields:

```txt
id
userId
label
line1
line2
city
state
postalCode
country
createdAt
updatedAt
```

Backend changes:

```txt
server/orders/repositories/order.repository.ts
server/orders/services/order.service.ts
app/api/orders/route.ts
app/api/orders/[orderId]/route.ts
```

Frontend changes:

```txt
app/checkout/page.tsx
app/account/page.tsx
app/orders/page.tsx
components/cart/cart-sidebar.tsx
```

Implementation notes:

- Snapshot `name`, `unitPrice`, and `lineTotal` in `OrderItem`.
- Clear or mark the cart as converted after order creation.
- Add basic order states first: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`.

## Phase 4: Account Improvements

Expand account pages around real database data.

Backend changes:

```txt
server/users/services/user.service.ts
server/orders/services/order.service.ts
```

Frontend changes:

```txt
app/account/page.tsx
app/orders/page.tsx
app/orders/[orderId]/page.tsx
```

User-facing features:

```txt
View profile
View recent orders
View order details
Reorder past order
Manage saved addresses
```

## Phase 5: Admin Menu Management

Add admin-only tools for menu management.

Backend changes:

```txt
server/auth/middleware/require-admin.middleware.ts
server/menu/services/menu-admin.service.ts
app/api/admin/menu/route.ts
app/api/admin/menu/[itemId]/route.ts
```

Frontend changes:

```txt
app/admin/menu/page.tsx
app/admin/menu/new/page.tsx
app/admin/menu/[itemId]/page.tsx
```

Admin features:

```txt
Create menu item
Edit menu item
Toggle availability
Update price
Update nutrition data
Upload or update image URL
```

## Suggested Prisma Model Names

```txt
User
MenuItem
Cart
CartItem
Order
OrderItem
Address
```

Suggested enums:

```txt
UserRole
MenuCategory
CartStatus
OrderStatus
```

## Migration Order

Recommended order:

```txt
1. Add MenuItem and MenuCategory
2. Seed current menu items
3. Replace static menu reads with database reads
4. Add Cart and CartItem
5. Replace localStorage cart with API/database cart
6. Add Order, OrderItem, Address, and OrderStatus
7. Add checkout flow
8. Add order history
9. Add admin menu management
```

## Testing Checklist

Database:

```txt
Prisma migration applies cleanly
Prisma client generates successfully
Seed script creates menu items
Menu item slugs are unique
Cart has only one active cart per user
Orders preserve item price snapshots
```

Backend:

```txt
Unauthenticated users cannot mutate carts
Users cannot read or mutate another user's cart
Order creation validates cart ownership
Unavailable items cannot be added to cart
Deleted or unavailable old menu items still render in past orders
```

Frontend:

```txt
Menu page loads from database
Nutrition page loads from database
Cart persists after refresh
Cart persists across devices for same account
Checkout creates an order
Account page shows recent orders
Empty states render cleanly
Loading and error states render cleanly
```

## Deployment Checklist

Before deploying:

```txt
npx prisma generate
npx prisma migrate dev
npm run build
```

For production:

```txt
npx prisma migrate deploy
```

Vercel needs:

```txt
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
```

After production migration:

```txt
Verify menu loads
Verify signup/login works
Verify cart mutations work
Verify checkout creates an order
Verify account order history works
```
