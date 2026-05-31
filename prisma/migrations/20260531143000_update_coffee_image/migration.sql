UPDATE "MenuItem"
SET
    "imageUrl" = '/menu/coffee.jpeg',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" IN ('protein-coffee', 'protein-coffee-regular');
