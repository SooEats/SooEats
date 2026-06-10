'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, UserCircle } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { clsx } from 'clsx';
import { useCart } from '@/lib/cart-context';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  links?: NavLink[];
}

const defaultLinks: NavLink[] = [
  { label: 'About',     href: '/about' },
  { label: 'Menu',      href: '/menu' },
  { label: 'Meal Plan', href: '/meal-plan' },
  { label: 'Nutrition', href: '/nutrition' },
  { label: 'Contact',   href: '/contact' },
];

export function Navbar({ links = defaultLinks }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { totalItems, setIsCartOpen, isAuthenticated, openAuthDialog } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try {
      const supabase = createSupabaseBrowserClient();

      supabase.auth.getUser().then(({ data }) => setUser(data.user));

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    } catch {
      return undefined;
    }
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const closeMobileMenu  = () => setIsMobileMenuOpen(false);
  const openCart = () => {
    if (!isAuthenticated) {
      openAuthDialog();
      return;
    }

    setIsCartOpen(true);
  };
  const signOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.assign('/login');
  };

  return (
    <nav
      className={clsx(
        'sticky top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]'
          : 'bg-white'
      )}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20 lg:grid lg:grid-cols-[minmax(0,2fr)_auto_minmax(0,1.5fr)] lg:gap-x-10 xl:gap-x-14">

          {/* Desktop navigation links */}
          <div className="hidden lg:flex min-w-0 items-center justify-end gap-4 xl:gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-[12px] xl:text-[13px] uppercase tracking-[0.14em] xl:tracking-widest text-brown-500 hover:text-orange-600 transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Centered brand with logo */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg px-2 py-1 sm:px-3 md:px-4 lg:w-lg lg:px-6 lg:justify-self-center"
            aria-label="SOOEATS Home"
          >
            <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16 md:h-20 md:w-20">
              <Image
                src="/newLogo.png"
                alt="SOOEATS"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="font-logo text-[19px] sm:text-[24px] md:text-[26px] tracking-wide leading-none">
                <span className="text-brown-900">SOO</span><span className="text-orange-500">EATS</span>
              </span>
              <span className="max-w-[11rem] truncate text-[6px] sm:max-w-[16rem] sm:text-[8px] md:max-w-none md:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.2em] md:tracking-[0.3em] text-brown-400 font-semibold mt-1">
                Healthy Has Never Tasted This Good
              </span>
            </div>
          </Link>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center justify-start gap-2 xl:gap-3">
            <div className="flex items-center gap-2 xl:gap-3">
              <button
                onClick={openCart}
                className="relative p-2 text-brown-700 hover:text-orange-600 transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link
                href="/menu"
                className="hidden xl:inline-flex px-5 py-2.5 text-[13px] uppercase tracking-widest text-white bg-brown-900 hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Order Now
              </Link>
            </div>
            {user ? (
              <>
                <Link
                  href="/account"
                  className="p-2 text-brown-700 hover:text-orange-600 transition-colors"
                  aria-label="Account"
                >
                  <UserCircle className="w-5 h-5" />
                </Link>
                <button
                  onClick={signOut}
                  className="whitespace-nowrap text-[12px] xl:text-[13px] uppercase tracking-[0.14em] xl:tracking-widest text-brown-500 hover:text-orange-600 transition-colors duration-300"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="whitespace-nowrap border border-green-600 bg-green-600 px-5 py-2.5 text-[12px] xl:text-[13px] uppercase tracking-[0.14em] xl:tracking-widest text-white hover:border-green-700 hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile: cart + toggle */}
          <div className="flex shrink-0 lg:hidden items-center gap-1 sm:gap-2">
            <button
              onClick={openCart}
              className="relative p-2 text-brown-700 hover:text-orange-600 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-brown-700 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen
                ? <X className="h-6 w-6" aria-hidden="true" />
                : <Menu className="h-6 w-6" aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-white border-t border-brown-100"
          >
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-sm uppercase tracking-widest text-brown-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/menu"
                onClick={closeMobileMenu}
                className="block mt-6 px-4 py-3 text-center bg-brown-900 text-white text-sm uppercase tracking-widest hover:bg-orange-600 transition-colors"
              >
                Order Now
              </Link>
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-sm uppercase tracking-widest text-brown-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      void signOut();
                    }}
                    className="block w-full px-4 py-3 text-left text-sm uppercase tracking-widest text-brown-600 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="block mt-4 px-4 py-3 text-center text-sm uppercase tracking-widest border border-green-600 bg-green-600 text-white hover:border-green-700 hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
