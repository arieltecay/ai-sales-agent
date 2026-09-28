import { useState, useCallback } from "react";

interface OrderDisplay {
  publicCode: string;
  total: number;
  items: Array<{ name: string; quantity: number; subtotal: number }>;
  customerName?: string | null;
  paymentIntent?: "cash" | "transfer" | null;
}

interface UseOrderConfirmOptions {
  slug: string;
  botKey: string;
  sessionId: string;
}

export function useOrderConfirm({ slug, botKey, sessionId }: UseOrderConfirmOptions) {
  void slug; void botKey; void sessionId;
  const [order, setOrder] = useState<OrderDisplay | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paidNotice, setPaidNotice] = useState<string | null>(null);

  const adoptLlmOrder = useCallback((publicCode: string, total: number, items: Array<{ name: string; quantity: number; subtotal: number }>) => {
    setOrder({ publicCode, total, items });
  }, []);

  const applyLlmCustomerUpdate = useCallback((customer: { publicCode: string; customerName: string | null; paymentIntent: "cash" | "transfer" | null }) => {
    setOrder(prev => prev ? { ...prev, customerName: customer.customerName, paymentIntent: customer.paymentIntent } : null);
  }, []);

  const setPaymentIntent = useCallback((intent: "cash" | "transfer") => {
    setOrder(prev => prev ? { ...prev, paymentIntent: intent } : null);
  }, []);

  const confirmOrder = useCallback(async (customerName: string) => {
    setConfirming(true);
    setError(null);
    try {
      setOrder(prev => prev ? { ...prev, customerName } : null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al confirmar";
      setError(message);
    } finally {
      setConfirming(false);
    }
  }, []);

  const markPaid = useCallback(async () => {
    setPaidNotice("¡Gracias! Tu pago ha sido confirmado.");
  }, []);

  return { order, confirming, error, paidNotice, adoptLlmOrder, applyLlmCustomerUpdate, setPaymentIntent, confirmOrder, markPaid };
}