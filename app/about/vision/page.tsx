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

export default function VisionPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/vision_banner.jpg"
            alt="Our vision"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brown-900/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/70 mb-4">About Us</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl">Our Vision</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-12">
            <Link href="/about" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-brown-500 hover:text-orange-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to About
            </Link>
          </motion.div>

          {/* Full-width intro text */}
          <motion.div {...fadeUp} className="max-w-3xl mb-24">
            <p className="text-[11px] uppercase tracking-[0.35em] text-green-600 mb-6">Where we&apos;re headed</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brown-900 leading-tight mb-8">
              Building a future where healthy eating is the norm, not the exception
            </h2>
            <div className="section-divider mb-8" />
            <p className="text-brown-500 text-lg leading-relaxed">
              Our vision is to reshape the way people experience everyday food by making healthy, balanced meals accessible, convenient, and effortless.
            </p>
          </motion.div>

          {/* Two images side by side */}
          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/vision_banner.jpg"
                alt="Our vision for the future"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/vision_banner.jpg"
                alt="Growing community"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Text block */}
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <p className="text-brown-500 text-lg leading-relaxed mb-6">
              SOO EATS aims to grow beyond a single brand into a trusted platform where individuals can easily discover and access better meal options without compromise.
            </p>
            <p className="text-brown-400 leading-relaxed mb-6">
              As we expand, we envision building a connected network of local food businesses that share our commitment to quality and nutrition — creating a system where healthier choices are not only available, but the easiest option.
            </p>
            <p className="text-brown-400 leading-relaxed">
              Through strong partnerships and a community-driven approach, we strive to support local businesses while helping people build better, more sustainable eating habits every day.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
