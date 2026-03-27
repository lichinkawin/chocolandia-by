"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CartItem = {
  id: string;
  code: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  slug: string;
  quantity: number;
};

type AddItemPayload = Omit<CartItem, "quantity"> & { quantity?: number };

type CartState = {
  items: CartItem[];
  addItem: (item: AddItemPayload) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((cartItem) => cartItem.id === item.id);
          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + (item.quantity ?? 1) }
                  : cartItem,
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: item.quantity ?? 1 }],
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== id) };
          }

          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "chocolandia-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export type { CartItem };
