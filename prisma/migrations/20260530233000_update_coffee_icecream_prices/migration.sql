UPDATE "MenuItem"
SET
    "price" = 9.99,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" IN ('strawberry-protein-ice-cream', 'blueberry-protein-ice-cream');

UPDATE "MenuItem"
SET
    "name" = 'Protein Coffee - Large',
    "price" = 6.99,
    "serving" = 'Large',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'protein-coffee';

INSERT INTO "MenuItem" (
    "id", "slug", "name", "description", "price", "imageUrl", "serving", "category",
    "calories", "protein", "carbs", "fats", "isAvailable", "sortOrder", "createdAt", "updatedAt"
)
VALUES (
    'menu_protein_coffee_regular',
    'protein-coffee-regular',
    'Protein Coffee - Regular',
    'Rich coffee blended with protein for an energizing boost',
    5.49,
    'https://picsum.photos/seed/protein-coffee/600/400',
    'Regular',
    'DRINKS',
    0,
    0,
    0,
    0,
    true,
    89,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE
SET
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
