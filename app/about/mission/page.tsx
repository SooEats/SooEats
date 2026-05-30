'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: 'easeOut' as const },
};

export default function MissionPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/mission_banner.jpg"
            alt="Our mission"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brown-900/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/70 mb-4">About Us</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl">Our Mission</h1>
        </div>
      </section>

      {/* Content - alternating layout */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-12">
            <Link href="/about" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-brown-500 hover:text-orange-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to About
            </Link>
          </motion.div>

          {/* Text left, image right */}
          <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-28">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-orange-500 mb-6">What drives us</p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-brown-900 leading-tight mb-8">
                Making healthy eating delicious and accessible
              </h2>
              <div className="section-divider mb-8" />
              <p className="text-brown-500 text-lg leading-relaxed mb-6">
                Our mission is to make healthy, high-protein meals simple, affordable, and satisfying. Whether you’re a student, a working professional, or constantly on the go, we create food that fuels your body without sacrificing taste or convenience.
              </p>
              <p className="text-brown-400 leading-relaxed">
                Every item we serve is thoughtfully crafted to deliver balanced nutrition while still feeling enjoyable and comforting.
              </p>
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/mission.png"
                alt="Our mission in action"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Image left, text right */}
          <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/mission2.png"
                alt="Our team"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-brown-500 text-lg leading-relaxed mb-6">
                At SOO EATS, we’re here to challenge traditional fast food by offering better alternatives that support long-term well-being.
              </p>
              <p className="text-brown-400 leading-relaxed">
                Our goal is to make healthier eating easy, accessible, and something people can stick to — every single day.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
