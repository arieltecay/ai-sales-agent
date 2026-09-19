import { useState, useCallback } from "react";

interface CartItem {
  product: string;
  quantity: number;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: string, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product === product);
      if (existing) {
        return prev.map(i => i.product === product ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((product: string) => {
    setItems(prev => prev.filter(i => i.product !== product));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const isEmpty = items.length === 0;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = 0; // Would need product prices

  return { items, addItem, removeItem, clear, isEmpty, itemCount, total };
}