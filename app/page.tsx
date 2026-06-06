'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMenuItems } from '@/lib/use-menu-items';
import { useCart } from '@/lib/cart-context';
import { useRef, useState } from 'react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

const hiddenFeaturedItemIds = new Set([
  'signature-protein-wrap-regular',
  'tandoori-wrap-regular',
  'protein-coffee-regular',
]);

function isComingSoon(item: { isAvailable?: boolean; macros: { calories: number } }) {
  return item.isAvailable === false || item.macros.calories === 0;
}

function FeaturedItemsCarousel() {
  const { addItem } = useCart();
  const menuItems = useMenuItems();
  const x = useMotionValue(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(-1); // px per frame

  useAnimationFrame(() => {
    if (isPaused) return;
    const current = x.get();
    const containerWidth = containerRef.current?.scrollWidth ?? 0;
    const halfWidth = containerWidth / 2;
    let next = current + speedRef.current;
    if (Math.abs(next) >= halfWidth) {
      next = 0;
    }
    x.set(next);
  });

  const featuredMenuItems = menuItems.filter((item) => !hiddenFeaturedItemIds.has(item.id));
  const items = [...featuredMenuItems, ...featuredMenuItems];

  return (
    <div
      className="relative max-w-7xl mx-auto overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #fdfaf6, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #fdfaf6, transparent)' }} />

      <motion.div
        ref={containerRef}
        className="flex gap-6 cursor-grab active:cursor-grabbing"
        style={{ x, width: 'max-content' }}
        drag="x"
        dragConstraints={{ left: -((items.length * 296) / 2), right: 0 }}
        onDragStart={() => setIsPaused(true)}
        onDragEnd={() => setIsPaused(false)}
      >
        {items.map((item, i) => (
          <div key={`${item.id}-${i}`} className="flex-shrink-0 w-[280px] group">
            <div className="relative w-[280px] h-[360px] overflow-hidden mb-4">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className={`object-cover transition-transform duration-700 ${
                  isComingSoon(item) ? 'blur-md' : 'group-hover:scale-105'
                }`}
              />
              {isComingSoon(item) ? (
                <div className="absolute inset-0 bg-brown-900/20 flex items-center justify-center">
                  <span className="px-4 py-2 bg-white/90 text-brown-900 text-[10px] uppercase tracking-[0.2em] font-bold">
                    Coming Soon
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => addItem(item)}
                  className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 hover:bg-orange-500 hover:text-white text-brown-900 rounded-full flex items-center justify-center shadow-md transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Add ${item.name} to cart`}
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex justify-between items-start px-1">
              <div>
                <h3 className="font-display font-bold text-lg text-brown-900">{item.name}</h3>
                <p className="text-brown-400 text-sm mt-1">{item.description}</p>
              </div>
              {!isComingSoon(item) && (
                <span className="font-semibold text-orange-500 text-lg ml-4 shrink-0">
                  ${item.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen relative">
      
      {/* Global Watermark Logo - Fixed behind content on scroll */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.08] z-0">
        <div className="relative w-[68vw] h-[68vw] max-w-[540px] max-h-[540px] rotate-[-15deg]">
          <Image
            src="/newLogo.png"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* HERO - Animated gradient background */}
        <motion.section
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] 
          }}
          transition={{ 
            duration: 10, 
            ease: "easeInOut", 
            repeat: Infinity 
          }}
          className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #f9ac54ff 0%, #f97316 25%, #d4a017 50%, #4ade80 75%, #0ea5e9 100%)',
            backgroundSize: '150% 150%',
          }}
        >
          {/* Section-specific Watermark for Hero (since Hero background is opaque) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.1]">
            <div className="relative w-[82vw] h-[82vw] max-w-[680px] max-h-[680px] rotate-[-15deg] blur-[2.5px] right-5 -top-6">
              <Image
                src="/newLogo.png"
                alt=""
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="max-w-3xl text-center px-8 relative z-10">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[12px] uppercase tracking-[0.35em] text-white/70 mb-6"
            >
              Welcome to SOOEATS
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-white mb-6"
            >
              Leaving You Wanting More
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-white/85 text-lg sm:text-xl mb-10 leading-relaxed"
            >
              Fresh, High-Protein, Packed with Flavor.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link href="/menu">
                <Button size="lg" className="bg-white text-brown-900 hover:bg-brown-900 hover:text-white shadow-none rounded-none px-10 py-4 text-sm uppercase tracking-widest font-semibold transition-colors duration-300 border-0">
                  View Menu
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* FEATURED ITEMS - Interactive marquee (first section after hero) */}
        <section className="bg-brown-50 py-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-16">
              <p className="text-[11px] uppercase tracking-[0.35em] text-orange-500 mb-4">
                Discover our menu
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-brown-900">
                Featured Items
              </h2>
            </motion.div>
          </div>

          <FeaturedItemsCarousel />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mt-12">
              <Link href="/menu">
                <Button variant="secondary" className="rounded-none border-brown-900 text-brown-900 hover:bg-brown-900 hover:text-black px-10 py-3 text-sm uppercase tracking-widest transition-colors duration-300">
                  View Full Menu <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* MEAL PLANS */}
        <section className="py-25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/meal-plan.png"
                  alt="Meal plans"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-green-600 mb-4">Coming Soon</p>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-brown-900 mb-4">
                  Personalised meal plans
                </h3>
                <div className="section-divider mb-6" />
                <p className="text-brown-500 leading-relaxed mb-8">
                  Curated weekly plans designed around your nutrition goals. Balanced, delicious, and delivered fresh to your door.
                </p>
                <Link href="/meal-plan">
                  <span className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-brown-900 hover:text-orange-600 transition-colors font-medium">
                    Join Waitlist <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* OUR PHILOSOPHY */}
        <section className="py-28 bg-brown-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <motion.div {...fadeUp}>
                <p className="text-[11px] uppercase tracking-[0.35em] text-orange-500 mb-6">
                  Our Philosophy
                </p>
                <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-brown-900 leading-tight mb-8">
                  Food that fuels your best self
                </h2>
                <div className="section-divider mb-8" />
                <p className="text-brown-500 text-lg leading-relaxed mb-6">
                  Every dish at SOOEATS starts with a simple question: what would genuinely nourish someone today?
                </p>
                <p className="text-brown-400 leading-relaxed mb-10">
                  Whether you&apos;re grabbing a quick lunch, planning a corporate event, or building a weekly meal plan, we&apos;ve got you covered with flavours that make healthy eating feel like a treat.
                </p>
                <Link href="/about">
                  <Button variant="secondary" className="rounded-none border-brown-900 text-brown-900 hover:bg-brown-900 hover:text-black px-8 py-3 text-sm uppercase tracking-widest transition-colors duration-300">
                    Our Story <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.15 }}
                className="relative aspect-[4/5] w-full"
              >
                <Image
                  src="/about-us.png"
                  alt="Fresh food"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
