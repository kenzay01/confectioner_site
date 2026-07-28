"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/types/cart";

const CART_STORAGE_KEY = "confectioner_cart";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (type: CartItem["type"], id: string) => void;
  setQuantity: (type: CartItem["type"], id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        item &&
        typeof item.id === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qtyToAdd = Math.max(1, item.quantity ?? 1);
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.type === item.type && i.id === item.id
        );
        if (existing) {
          const max = item.maxQuantity ?? existing.maxQuantity;
          const nextQty = existing.quantity + qtyToAdd;
          return prev.map((i) =>
            i.type === item.type && i.id === item.id
              ? {
                  ...i,
                  ...item,
                  quantity: max != null ? Math.min(nextQty, max) : nextQty,
                  maxQuantity: max,
                }
              : i
          );
        }
        const max = item.maxQuantity;
        return [
          ...prev,
          {
            ...item,
            quantity: max != null ? Math.min(qtyToAdd, max) : qtyToAdd,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((type: CartItem["type"], id: string) => {
    setItems((prev) => prev.filter((i) => !(i.type === type && i.id === id)));
  }, []);

  const setQuantity = useCallback(
    (type: CartItem["type"], id: string, quantity: number) => {
      setItems((prev) =>
        prev
          .map((i) => {
            if (i.type !== type || i.id !== id) return i;
            const max = i.maxQuantity;
            const next =
              max != null
                ? Math.min(Math.max(0, quantity), max)
                : Math.max(0, quantity);
            return { ...i, quantity: next };
          })
          .filter((i) => i.quantity > 0)
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      totalPrice,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [items, itemCount, totalPrice, addItem, removeItem, setQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
