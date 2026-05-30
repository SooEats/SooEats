'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import type { FoodItem } from '@/lib/data/menu';
import { useMenuItems } from '@/lib/use-menu-items';
import { useCart } from '@/lib/cart-context';

const categories = ['breakfast', 'lunch', 'drinks', 'dessert'] as const;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: 'easeOut' as const },
};

const wrapVariantGroups: Record<string, string[]> = {
  'signature-protein-wrap': ['signature-protein-wrap-regular', 'signature-protein-wrap'],
  'tandoori-wrap': ['tandoori-wrap-regular', 'tandoori-wrap'],
};

const hiddenVariantIds = new Set(Object.values(wrapVariantGroups).flatMap((ids) => ids.slice(0, -1)));

function getDisplayName(item: FoodItem) {
  return item.name.replace(/\s+-\s+(Regular|Large)$/i, '');
}

function getVariantLabel(item: FoodItem) {
  return item.name.match(/Regular|Large/i)?.[0] ?? 'Add';
}

export default function MenuPage() {
  const { addItem } = useCart();
  const menuItems = useMenuItems();

  return (
    <main>
      {/* Hero - Full-width image */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/menu.png"
            alt="Our menu"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brown-900/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.35em] text-white/70 mb-4"
          >
            What we serve
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl"
          >
            Our Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/60 text-lg mt-4 max-w-lg mx-auto"
          >
            Healthy has never tasted this good
          </motion.p>
        </div>
      </section>

      {/* Menu sections by category */}
      {categories.map((category) => {
        const items = menuItems.filter((item) => item.category === category && !hiddenVariantIds.has(item.id));
        return (
          <section key={category} className="py-24 even:bg-brown-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div {...fadeUp} className="mb-14">
                <p className="text-[11px] uppercase tracking-[0.35em] text-orange-500 mb-3">
                  {category}
                </p>
                <div className="section-divider" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {items.map((item, i) => {
                  const variants = wrapVariantGroups[item.id]
                    ?.map((variantId) => menuItems.find((candidate) => candidate.id === variantId))
                    .filter((variant): variant is FoodItem => Boolean(variant));
                  const hasVariants = Boolean(variants?.length);
                  const displayPrice = hasVariants
                    ? `$${variants![0].price.toFixed(2)} - $${variants![variants!.length - 1].price.toFixed(2)}`
                    : `$${item.price.toFixed(2)}`;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="group"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden mb-5">
                        <Image
                          src={item.image}
                          alt={getDisplayName(item)}
                          fill
                          className={`object-cover transition-transform duration-700 ${
                            item.macros.calories === 0 ? 'blur-md' : 'group-hover:scale-105'
                          }`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {item.macros.calories === 0 ? (
                          <div className="absolute inset-0 bg-brown-900/20 flex items-center justify-center">
                            <span className="px-4 py-2 bg-white/90 text-brown-900 text-[10px] uppercase tracking-[0.2em] font-bold">
                              Coming Soon
                            </span>
                          </div>
                        ) : !hasVariants ? (
                          <button
                            onClick={() => addItem(item)}
                            className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 hover:bg-orange-500 hover:text-white text-brown-900 rounded-full flex items-center justify-center shadow-md transition-colors opacity-0 group-hover:opacity-100"
                            aria-label={`Add ${item.name} to cart`}
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-display font-bold text-xl text-brown-900 mb-1">
                            {getDisplayName(item)}
                          </h3>
                          <p className="text-brown-400 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <span className="font-display font-bold text-xl text-orange-500 shrink-0">
                          {displayPrice}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-6 mt-3 text-xs text-brown-400">
                        <span className="font-medium">{hasVariants ? 'Regular 2 / Large 4' : item.serving}</span>
                        {item.macros.calories > 0 && !hasVariants && (
                          <>
                            <span>{item.macros.calories} cal</span>
                            <span>{item.macros.protein}g protein</span>
                            <span>{item.macros.carbs}g carbs</span>
                            <span>{item.macros.fats}g fats</span>
                          </>
                        )}
                      </div>
                      {item.macros.calories > 0 && (
                        hasVariants ? (
                          <div className="mt-4 grid grid-cols-2 gap-3">
                            {variants!.map((variant) => (
                              <button
                                key={variant.id}
                                onClick={() => addItem(variant)}
                                className="py-2.5 text-xs uppercase tracking-widest font-semibold border border-brown-200 text-brown-900 hover:bg-brown-900 hover:text-white transition-colors"
                              >
                                {getVariantLabel(variant)} ${variant.price.toFixed(2)}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => addItem(item)}
                            className="mt-4 w-full py-2.5 text-xs uppercase tracking-widest font-semibold border border-brown-200 text-brown-900 hover:bg-brown-900 hover:text-white transition-colors lg:hidden"
                          >
                            Add to Cart
                          </button>
                        )
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
