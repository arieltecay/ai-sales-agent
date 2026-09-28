export type BotConfig =
  | { available: true; businessName: string; greeting: string; quickReplies: string[]; whatsappNumber: string; transferInfo: { alias: string; cbu: string } | null }
  | { available: false; businessName: string };

export interface ChatStreamHandlers {
  onText: (_content: string) => void;
  onToolCall: (_toolName: string) => void;
  onTextReset?: () => void;
  onOrder?: (_order: { publicCode: string; total: number; items: Array<{ name: string; quantity: number; unitPrice: number; subtotal: number }> }) => void;
  onCustomer?: (_customer: { publicCode: string; customerName: string | null; paymentIntent: "cash" | "transfer" | null }) => void;
  onDone: () => void;
  onError: (_message: string) => void;
}

export interface CreateOrderParams {
  slug: string;
  botKey: string;
  sessionId?: string;
  items: Array<{ product: string; quantity: number }>;
  customerName?: string;
  customerPhone?: string;
}

export interface CreatedOrder {
  publicCode: string;
  total: number;
  items: Array<{ name: string; quantity: number; subtotal: number }>;
}

export interface SendChatMessageParams extends ChatStreamHandlers {
  slug: string;
  botKey: string;
  sessionId: string;
  message: string;
}

export interface SseEventData {
  content?: string;
  toolName?: string;
  message?: string;
  publicCode?: string;
  total?: number;
  items?: Array<{ name: string; quantity: number; unitPrice: number; subtotal: number }>;
  customerName?: string | null;
  paymentIntent?: "cash" | "transfer" | null;
}