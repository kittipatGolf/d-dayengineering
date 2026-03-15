"use client";

import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";

export type CartItem = {
  cartId: string;
  type: "door" | "part";
  name: string;
  categoryName: string;
  images: string[];
  color: string;
  widthM: number;
  lengthM: number;
  thickness: string;
  installOption: string;
  quantity: number;
  pricePerUnit: number;
  warranty: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cartId">) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "d-day-cart";

function generateCartId() {
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function persistToStorage(items: CartItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "cartId">) => {
    setItems((prev) => {
      const next = [...prev, { ...item, cartId: generateCartId() }];
      persistToStorage(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.cartId !== cartId);
      persistToStorage(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const next = prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i));
      persistToStorage(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    persistToStorage([]);
  }, []);

  const totalAmount = items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, totalAmount, totalItems }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalAmount, totalItems],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
