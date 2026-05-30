// Centralized food data for Menu, Nutrition, and Cart

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  serving: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  category: 'breakfast' | 'lunch' | 'drinks' | 'dessert';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Menu items — real SOOEATS products with nutritional data
export const menuItems: FoodItem[] = [
  // ── Breakfast ──
  {
    id: 'protein-pancakes',
    name: 'Protein Pancake',
    description: '3 fluffy high protein pancakes serve with maple syrup',
    price: 12.99,
    image: '/menu/pancake.jpeg',
    serving: '3 pancakes',
    macros: { calories: 778, protein: 64, carbs: 91, fats: 16 },
    category: 'breakfast',
  },

  // ── Lunch ──
  {
    id: 'signature-protein-wrap',
    name: 'Signature Wrap - Large',
    description: 'Crispy and loaded wraps packed with high protein',
    price: 18.99,
    image: '/menu/protein_wrap.jpeg',
    serving: 'Large - serving 4',
    macros: { calories: 1032, protein: 86, carbs: 80, fats: 38 },
    category: 'lunch',
  },
  {
    id: 'signature-protein-wrap-regular',
    name: 'Signature Wrap - Regular',
    description: 'Crispy and loaded wraps packed with high protein',
    price: 12.99,
    image: '/menu/protein_wrap.jpeg',
    serving: 'Regular - serving 2',
    macros: { calories: 516, protein: 43, carbs: 40, fats: 19 },
    category: 'lunch',
  },
  {
    id: 'tandoori-wrap',
    name: 'Tandoori Wrap - Large',
    description: 'Crispy and smoky tandoori spiced wraps packed with high protein',
    price: 18.99,
    image: '/menu/tandoori_wrap.png',
    serving: 'Large - serving 4',
    macros: { calories: 1032, protein: 102, carbs: 73, fats: 35 },
    category: 'lunch',
  },
  {
    id: 'tandoori-wrap-regular',
    name: 'Tandoori Wrap - Regular',
    description: 'Crispy and smoky tandoori spiced wraps packed with high protein',
    price: 12.99,
    image: '/menu/tandoori_wrap.png',
    serving: 'Regular - serving 2',
    macros: { calories: 516, protein: 51, carbs: 37, fats: 17 },
    category: 'lunch',
  },
  {
    id: 'chicken-steak-rice',
    name: 'Chicken Steak and Fried Rice',
    description: 'Oven baked chicken steak served with fried rice',
    price: 12.99,
    image: '/menu/chicken_steak_rice.jpeg',
    serving: 'Half breast & 300g rice',
    macros: { calories: 706, protein: 35, carbs: 63, fats: 34 },
    category: 'lunch',
  },
  {
    id: 'protein-pasta',
    name: 'Protein Pasta',
    description: 'High-protein pasta tossed in a signature sauce with fresh herbs',
    price: 12.99,
    image: '/menu/pasta.jpeg',
    serving: '1 serving',
    macros: { calories: 1120, protein: 77, carbs: 117, fats: 33 },
    category: 'lunch',
  },

  // ── Dessert ──
  {
    id: 'strawberry-protein-ice-cream',
    name: 'Strawberry Protein Ice-Cream',
    description: 'Luscious strawberry ice-cream packed with protein — 230ml serving',
    price: 9.99,
    image: '/menu/icecream-Strawberry.jpeg',
    serving: '230ml',
    macros: { calories: 190, protein: 23, carbs: 10, fats: 6 },
    category: 'dessert',
  },
  {
    id: 'blueberry-protein-ice-cream',
    name: 'Blueberry Protein Ice-Cream',
    description: 'Creamy blueberry ice-cream loaded with protein — 230ml serving',
    price: 9.99,
    image: '/menu/icecream-Blueberry.jpeg',
    serving: '230ml',
    macros: { calories: 195, protein: 23, carbs: 12, fats: 6 },
    category: 'dessert',
  },
  {
    id: 'protein-cheesecake',
    name: 'Protein Cheesecake',
    description: 'Indulgent cheesecake with a protein-packed twist',
    price: 9.99,
    image: 'https://picsum.photos/seed/protein-cheesecake/600/400',
    serving: '1 slice',
    macros: { calories: 0, protein: 0, carbs: 0, fats: 0 },
    category: 'dessert',
  },

  // ── Drinks ──
  {
    id: 'protein-coffee',
    name: 'Protein Coffee - Large',
    description: 'Rich coffee blended with protein for an energizing boost',
    price: 6.99,
    image: 'https://picsum.photos/seed/protein-coffee/600/400',
    serving: 'Large',
    macros: { calories: 0, protein: 0, carbs: 0, fats: 0 },
    category: 'drinks',
  },
  {
    id: 'protein-coffee-regular',
    name: 'Protein Coffee - Regular',
    description: 'Rich coffee blended with protein for an energizing boost',
    price: 5.49,
    image: 'https://picsum.photos/seed/protein-coffee/600/400',
    serving: 'Regular',
    macros: { calories: 0, protein: 0, carbs: 0, fats: 0 },
    category: 'drinks',
  },
];
