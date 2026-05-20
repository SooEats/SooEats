'use client';

import Link from 'next/link';
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { FoodItem } from '@/lib/data/menu';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export interface CartItem {
  item: FoodItem;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: FoodItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  openAuthDialog: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function getCurrentPath() {
  if (typeof window === 'undefined') return '/menu';
  return `${window.location.pathname}${window.location.search}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const isAuthenticated = Boolean(userId);

  const loadCart = useCallback(async () => {
    const response = await fetch('/api/cart');
    if (!response.ok) {
      setItems([]);
      return;
    }

    const payload = (await response.json().catch(() => null)) as { items?: CartItem[] } | null;
    setItems(payload?.items ?? []);
  }, []);

  useEffect(() => {
    try {
      const supabase = createSupabaseBrowserClient();

      supabase.auth.getUser().then(({ data }) => {
        const nextUserId = data.user?.id ?? null;
        setUserId(nextUserId);
        if (nextUserId) void loadCart();
        else setItems([]);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        const nextUserId = session?.user.id ?? null;
        setUserId(nextUserId);
        if (nextUserId) void loadCart();
        else setItems([]);
      });

      return () => subscription.unsubscribe();
    } catch {
      return undefined;
    }
  }, [loadCart]);

  const openAuthDialog = useCallback(() => {
    setIsCartOpen(false);
    setIsAuthDialogOpen(true);
  }, []);

  const addItem = useCallback(async (item: FoodItem) => {
    if (!userId) {
      openAuthDialog();
      return;
    }

    const previousItems = items;
    setItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.item.id === item.id);
      if (!existing) return [...prev, { item, quantity: 1 }];
      return prev.map((cartItem) =>
        cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      );
    });

    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menuItemId: item.id }),
    });

    if (!response.ok) {
      setItems(previousItems);
      return;
    }

    const payload = (await response.json().catch(() => null)) as { items?: CartItem[] } | null;
    setItems(payload?.items ?? []);
  }, [items, openAuthDialog, userId]);

  const removeItem = useCallback(async (itemId: string) => {
    if (!userId) {
      openAuthDialog();
      return;
    }

    const previousItems = items;
    setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));

    const response = await fetch(`/api/cart/items/${encodeURIComponent(itemId)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setItems(previousItems);
      return;
    }

    const payload = (await response.json().catch(() => null)) as { items?: CartItem[] } | null;
    setItems(payload?.items ?? []);
  }, [items, openAuthDialog, userId]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!userId) {
      openAuthDialog();
      return;
    }

    const previousItems = items;
    if (quantity <= 0) {
      setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
    } else {
      setItems((prev) =>
        prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity } : ci))
      );
    }

    const response = await fetch(`/api/cart/items/${encodeURIComponent(itemId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      setItems(previousItems);
      return;
    }

    const payload = (await response.json().catch(() => null)) as { items?: CartItem[] } | null;
    setItems(payload?.items ?? []);
  }, [items, openAuthDialog, userId]);

  const clearCart = useCallback(async () => {
    if (!userId) {
      openAuthDialog();
      return;
    }

    const previousItems = items;
    setItems([]);

    const response = await fetch('/api/cart', { method: 'DELETE' });
    if (!response.ok) {
      setItems(previousItems);
      return;
    }

    const payload = (await response.json().catch(() => null)) as { items?: CartItem[] } | null;
    setItems(payload?.items ?? []);
  }, [items, openAuthDialog, userId]);

  const totalItems = items.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalPrice = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const loginHref = `/login?next=${encodeURIComponent(getCurrentPath())}`;
  const signupHref = `/signup?next=${encodeURIComponent(getCurrentPath())}`;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        isAuthenticated,
        openAuthDialog,
      }}
    >
      {children}
      {isAuthDialogOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-auth-title"
        >
          <div className="w-full max-w-sm bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-500">
                  Sign in required
                </p>
                <h2 id="cart-auth-title" className="font-display text-2xl font-bold text-brown-900">
                  Save this to your cart
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthDialogOpen(false)}
                className="p-1 text-brown-400 transition-colors hover:text-brown-900"
                aria-label="Close sign in dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 text-sm leading-6 text-brown-500">
              Sign in first so your cart stays private to your account.
            </p>
            <div className="space-y-3">
              <Link
                href={loginHref}
                onClick={() => setIsAuthDialogOpen(false)}
                className="flex w-full items-center justify-center bg-brown-900 px-5 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-orange-600"
              >
                Sign in
              </Link>
              <Link
                href={signupHref}
                onClick={() => setIsAuthDialogOpen(false)}
                className="flex w-full items-center justify-center border border-brown-200 px-5 py-3 text-sm font-semibold uppercase tracking-widest text-brown-800 transition-colors hover:border-orange-400 hover:text-orange-600"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
