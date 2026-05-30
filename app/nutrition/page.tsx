'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMenuItems } from '@/lib/use-menu-items';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: 'easeOut' as const },
};

const hiddenNutritionItemIds = new Set(['protein-coffee-regular']);

export default function NutritionPage() {
  const menuItems = useMenuItems().filter((item) => !hiddenNutritionItemIds.has(item.id));

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/nutrition.png"
            alt="Nutrition information"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brown-900/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[11px] uppercase tracking-[0.35em] text-green-400 mb-4">
            Know what you eat
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl">
            Nutrition Info
          </h1>
          <p className="text-white/60 text-lg mt-4 max-w-lg mx-auto">
            Full macro breakdowns for every item — because transparency matters.
          </p>
        </div>
      </section>

      {/* Legend */}
      <section className="bg-brown-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-xs uppercase tracking-widest text-brown-500">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500" /> Calories
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" /> Protein
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brown-400" /> Carbs
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-300" /> Fats
            </span>
          </div>
        </div>
      </section>

      {/* Nutrition table-style layout */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.35em] text-orange-500 mb-4">
              Full breakdown
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brown-900">
              Every item, every macro
            </h2>
          </motion.div>

          <div className="space-y-6">
            {menuItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center py-8 border-b border-brown-100 last:border-b-0"
              >
                {/* Image */}
                <div className="relative aspect-[3/2] w-full md:w-[200px] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className={`object-cover ${item.macros.calories === 0 ? 'scale-110 blur-xl' : ''}`}
                    sizes="200px"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-orange-500 mb-1">{item.category}</p>
                    <h3 className="font-display font-bold text-lg text-brown-900">{item.name}</h3>
                    <p className="text-brown-400 text-sm mt-1">{item.description}</p>
                    <p className="text-brown-500 text-xs mt-1 font-medium">Serving: {item.serving}</p>
                  </div>

                  {/* Macro values */}
                  <div className="flex gap-6 sm:gap-8 shrink-0">
                    {item.macros.calories > 0 ? (
                      <>
                        <div className="text-center">
                          <p className="font-bold text-orange-500 text-lg">{item.macros.calories}</p>
                          <p className="text-[10px] uppercase tracking-widest text-brown-400">Cal</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-green-600 text-lg">{item.macros.protein}g</p>
                          <p className="text-[10px] uppercase tracking-widest text-brown-400">Protein</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-brown-600 text-lg">{item.macros.carbs}g</p>
                          <p className="text-[10px] uppercase tracking-widest text-brown-400">Carbs</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-orange-400 text-lg">{item.macros.fats}g</p>
                          <p className="text-[10px] uppercase tracking-widest text-brown-400">Fats</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <p className="font-bold text-orange-500 text-lg">X</p>
                          <p className="text-[10px] uppercase tracking-widest text-brown-400">Cal</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-green-600 text-lg">Xg</p>
                          <p className="text-[10px] uppercase tracking-widest text-brown-400">Protein</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-brown-600 text-lg">Xg</p>
                          <p className="text-[10px] uppercase tracking-widest text-brown-400">Carbs</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-orange-400 text-lg">Xg</p>
                          <p className="text-[10px] uppercase tracking-widest text-brown-400">Fats</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
