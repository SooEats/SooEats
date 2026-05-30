UPDATE "MenuItem"
SET
    "name" = 'Protein Pancake',
    "description" = '3 fluffy high protein pancakes serve with maple syrup',
    "price" = 12.99,
    "serving" = '3 pancakes',
    "calories" = 778,
    "protein" = 64,
    "carbs" = 91,
    "fats" = 16,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'protein-pancakes';

UPDATE "MenuItem"
SET
    "name" = 'Signature Wrap - Large',
    "description" = 'Crispy and loaded wraps packed with high protein',
    "price" = 18.99,
    "serving" = 'Large - serving 4',
    "calories" = 1032,
    "protein" = 86,
    "carbs" = 80,
    "fats" = 38,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'signature-protein-wrap';

INSERT INTO "MenuItem" (
    "id", "slug", "name", "description", "price", "imageUrl", "serving", "category",
    "calories", "protein", "carbs", "fats", "isAvailable", "sortOrder", "createdAt", "updatedAt"
)
VALUES (
    'menu_signature_protein_wrap_regular',
    'signature-protein-wrap-regular',
    'Signature Wrap - Regular',
    'Crispy and loaded wraps packed with high protein',
    12.99,
    '/menu/protein_wrap.jpeg',
    'Regular - serving 2',
    'LUNCH',
    516,
    43,
    40,
    19,
    true,
    21,
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

UPDATE "MenuItem"
SET
    "name" = 'Tandoori Wrap - Large',
    "description" = 'Crispy and smoky tandoori spiced wraps packed with high protein',
    "price" = 18.99,
    "imageUrl" = '/menu/tandoori_wrap.png',
    "serving" = 'Large - serving 4',
    "calories" = 1032,
    "protein" = 102,
    "carbs" = 73,
    "fats" = 35,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'tandoori-wrap';

INSERT INTO "MenuItem" (
    "id", "slug", "name", "description", "price", "imageUrl", "serving", "category",
    "calories", "protein", "carbs", "fats", "isAvailable", "sortOrder", "createdAt", "updatedAt"
)
VALUES (
    'menu_tandoori_wrap_regular',
    'tandoori-wrap-regular',
    'Tandoori Wrap - Regular',
    'Crispy and smoky tandoori spiced wraps packed with high protein',
    12.99,
    '/menu/tandoori_wrap.png',
    'Regular - serving 2',
    'LUNCH',
    516,
    51,
    37,
    17,
    true,
    31,
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

UPDATE "MenuItem"
SET
    "name" = 'Chicken Steak and Fried Rice',
    "description" = 'Oven baked chicken steak served with fried rice',
    "calories" = 706,
    "protein" = 35,
    "carbs" = 63,
    "fats" = 34,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'chicken-steak-rice';

UPDATE "MenuItem"
SET
    "calories" = 1120,
    "protein" = 77,
    "carbs" = 117,
    "fats" = 33,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'protein-pasta';

UPDATE "MenuItem"
SET
    "calories" = 190,
    "protein" = 23,
    "carbs" = 10,
    "fats" = 6,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'strawberry-protein-ice-cream';

UPDATE "MenuItem"
SET
    "calories" = 195,
    "protein" = 23,
    "carbs" = 12,
    "fats" = 6,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'blueberry-protein-ice-cream';

UPDATE "MenuItem"
SET
    "calories" = 0,
    "protein" = 0,
    "carbs" = 0,
    "fats" = 0,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" IN ('protein-coffee', 'protein-cheesecake');
