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

export default function SooEatsPage() {
  const menuItems = useMenuItems();
  const featured = menuItems.filter((item) => item.macros.calories > 0).slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/soo-eats-hero/1600/800"
            alt="SOOEATS Nutrition"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brown-900/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[11px] uppercase tracking-[0.35em] text-orange-400 mb-4">
            Our Products
          </p>
          <h1 className="font-logo font-bold text-4xl sm:text-5xl md:text-6xl">
            SOOEATS Nutrition
          </h1>
          <p className="text-white/60 text-lg mt-4 max-w-lg mx-auto">
            High-protein, healthy products crafted with care — because healthy has never tasted this good.
          </p>
        </div>
      </section>

      {/* Intro split section */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-28">
            <motion.div {...fadeUp}>
              <p className="text-[11px] uppercase tracking-[0.35em] text-orange-500 mb-6">
                The story
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-brown-900 leading-tight mb-8">
                Built on a passion for healthy food
              </h2>
              <div className="section-divider mb-8" />
              <p className="text-brown-500 text-lg leading-relaxed mb-6">
                SOOEATS was born from a simple belief: healthy food should taste incredible. Every product is crafted with high-quality, nutrient-dense ingredients.
              </p>
              <p className="text-brown-400 leading-relaxed">
                From protein-packed meals to guilt-free desserts and drinks, every item is designed to fuel your body without compromising on flavour.
              </p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/partnership/800/800"
                  alt="SOOEATS products"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Products - alternating layout */}
          <motion.div {...fadeUp} className="text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.35em] text-orange-500 mb-4">
              Available now
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brown-900">
              Our Products
            </h2>
          </motion.div>

          <div className="space-y-24">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                {...fadeUp}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
              >
                <div className={`relative aspect-[4/3] w-full overflow-hidden ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <span className="text-[11px] uppercase tracking-[0.35em] text-orange-500 mb-3 block">
                    {product.category}
                  </span>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-brown-900 mb-4">
                    {product.name}
                  </h3>
                  <div className="section-divider mb-6" />
                  <p className="text-brown-500 leading-relaxed mb-4">{product.description}</p>
                  <div className="flex gap-6 text-sm text-brown-400">
                    <span>{product.serving}</span>
                    <span>{product.macros.calories} cal</span>
                    <span>{product.macros.protein}g protein</span>
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
