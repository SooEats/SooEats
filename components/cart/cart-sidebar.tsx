'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';

export function CartSidebar() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isCartOpen, setIsCartOpen, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brown-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-brown-900" />
                <h2 className="font-display font-bold text-xl text-brown-900">
                  Your Cart ({totalItems})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-brown-500 hover:text-brown-900 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-brown-200 mb-4" />
                  <p className="text-brown-500 font-medium">Your cart is empty</p>
                  <p className="text-brown-400 text-sm mt-1">Add items from the menu to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((ci) => (
                    <div key={ci.item.id} className="flex gap-4 py-4 border-b border-brown-50">
                      <div className="flex-1">
                        <h3 className="font-semibold text-brown-900 text-sm">{ci.item.name}</h3>
                        <p className="text-brown-400 text-xs mt-0.5">{ci.item.serving}</p>
                        <p className="text-orange-500 font-semibold text-sm mt-1">
                          ${(ci.item.price * ci.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                          className="w-8 h-8 border border-brown-200 flex items-center justify-center text-brown-500 hover:border-orange-500 hover:text-orange-500 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium text-brown-900 w-6 text-center">
                          {ci.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                          className="w-8 h-8 border border-brown-200 flex items-center justify-center text-brown-500 hover:border-orange-500 hover:text-orange-500 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(ci.item.id)}
                        className="text-brown-300 hover:text-red-500 transition-colors self-start"
                        aria-label={`Remove ${ci.item.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brown-100 px-6 py-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-brown-500 text-sm uppercase tracking-widest">Total</span>
                  <span className="font-display font-bold text-2xl text-brown-900">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                  <Button className="w-full bg-brown-900 text-white hover:bg-orange-600 shadow-none rounded-none px-8 py-4 text-sm uppercase tracking-widest font-semibold transition-colors duration-300">
                    Proceed to Checkout
                  </Button>
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-brown-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
