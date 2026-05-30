UPDATE "MenuItem"
SET
    "name" = 'Pancake',
    "description" = '3 fluffy high protein pancakes serve with maple syrup',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'protein-pancakes';

UPDATE "MenuItem"
SET
    "name" = 'Signature Wraps',
    "description" = 'Crispy and loaded wraps packed with high protein',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'signature-protein-wrap';

UPDATE "MenuItem"
SET
    "name" = 'Tandoori Wraps',
    "description" = 'Crispy and smoky tandoori spiced wraps packed with high protein',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'tandoori-wrap';

UPDATE "MenuItem"
SET
    "name" = 'Steak and Fried Rice',
    "description" = 'Oven baked chicken steak served with fried rice',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'chicken-steak-rice';
