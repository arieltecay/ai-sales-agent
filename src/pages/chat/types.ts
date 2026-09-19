export interface OrderDisplay {
  publicCode: string;
  total: number;
  items: Array<{ name: string; quantity: number; subtotal: number }>;
  customerName?: string | null;
  paymentIntent?: "cash" | "transfer" | null;
}