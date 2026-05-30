'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Phone, Mail, Instagram, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const contactSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  { Icon: Phone,     label: 'Phone',     value: '705-975-7396',          href: 'tel:7059757396' },
  { Icon: Mail,      label: 'Email',     value: 'sooeats1@gmail.com',    href: 'mailto:sooeats1@gmail.com' },
  { Icon: Instagram, label: 'Instagram', value: '@soo__eats_',           href: 'https://instagram.com/soo__eats_' },
  { Icon: MapPin,    label: 'Location',  value: 'Coming Soon',           href: '#' },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: 'easeOut' as const },
};

export default function ContactPage() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    try {
      console.log('Form data:', data);
      setSubmitStatus('success');
      reset();
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/Contact.png"
            alt="Contact us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brown-900/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/70 mb-4">Say hello</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl">Contact Us</h1>
          <p className="text-white/60 text-lg mt-4 max-w-lg mx-auto">
            We&apos;d love to hear from you — whether it&apos;s a question, a booking, or just a hello.
          </p>
        </div>
      </section>

      {/* Contact section - split layout */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Left: contact info */}
            <motion.div {...fadeUp}>
              <p className="text-[11px] uppercase tracking-[0.35em] text-orange-500 mb-6">
                Get in touch
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-brown-900 leading-tight mb-8">
                We&apos;d love to hear from you
              </h2>
              <div className="section-divider mb-8" />
              <p className="text-brown-500 leading-relaxed mb-12">
                Fill out some info and we will be in touch shortly. We&apos;re always happy to chat about catering, partnerships, or anything food-related.
              </p>

              <div className="space-y-6">
                {contactInfo.map(({ Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-5 group"
                  >
                    <div className="w-12 h-12 border border-brown-200 flex items-center justify-center text-brown-500 group-hover:border-orange-500 group-hover:text-orange-500 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-brown-400 mb-0.5">{label}</p>
                      <p className="text-brown-800 font-medium text-sm group-hover:text-orange-600 transition-colors">{value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              <div className="bg-brown-50 p-8 sm:p-12">
                <h3 className="font-display font-bold text-2xl text-brown-900 mb-8">
                  Send a message
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-[11px] uppercase tracking-widest text-brown-500 mb-2">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      placeholder="Jane Smith"
                      className="w-full px-4 py-3 border border-brown-200 bg-white text-brown-800 placeholder-brown-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[11px] uppercase tracking-widest text-brown-500 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 border border-brown-200 bg-white text-brown-800 placeholder-brown-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[11px] uppercase tracking-widest text-brown-500 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      {...register('message')}
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="w-full px-4 py-3 border border-brown-200 bg-white text-brown-800 placeholder-brown-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none"
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-brown-900 text-white hover:bg-orange-600 shadow-none rounded-none px-8 py-4 text-sm uppercase tracking-widest font-semibold transition-colors duration-300 gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className="w-4 h-4" />
                  </Button>

                  {submitStatus === 'success' && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-600 text-sm text-center font-medium"
                    >
                      Message sent! We&apos;ll be in touch soon.
                    </motion.p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
