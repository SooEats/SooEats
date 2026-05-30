UPDATE "MenuItem"
SET
    "price" = 12.99,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" IN ('chicken-steak-rice', 'protein-pasta');
