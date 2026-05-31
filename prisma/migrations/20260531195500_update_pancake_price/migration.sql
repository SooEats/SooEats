UPDATE "MenuItem"
SET
    "price" = 10.99,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'protein-pancakes';
