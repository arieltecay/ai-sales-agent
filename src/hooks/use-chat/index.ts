import { useState, useCallback } from "react";
import { sendChatMessage } from "../../api/bot/bot";

interface UseChatOptions {
  slug: string;
  botKey: string;
  sessionId: string;
  businessName?: string;
  onOrder?: (order: { publicCode: string; total: number; items: Array<{ name: string; quantity: number; subtotal: number }> }) => void;
  onCustomer?: (customer: { publicCode: string; customerName: string | null; paymentIntent: "cash" | "transfer" | null }) => void;
}

export function useChat({ slug, botKey, sessionId, onOrder, onCustomer }: UseChatOptions) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setIsTyping(true);

    try {
      await sendChatMessage({
        slug,
        botKey,
        sessionId,
        message: text,
        onText: (content: string) => {
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.role === "assistant") {
              return [...prev.slice(0, -1), { ...last, content: last.content + content }];
            }
            return [...prev, { role: "assistant", content }];
          });
        },
        onToolCall: () => {},
        onOrder: onOrder ? (o) => { onOrder(o); } : undefined,
        onCustomer: onCustomer ? (c) => { onCustomer(c); } : undefined,
        onDone: () => { setIsTyping(false); },
        onError: (msg: string) => {
          setMessages(prev => [...prev, { role: "assistant", content: msg }]);
          setIsTyping(false);
        },
      });
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "No pudimos conectar con el asistente. Probá de nuevo en un momento." }]);
      setIsTyping(false);
    }
  }, [slug, botKey, sessionId, onOrder, onCustomer]);

  const setGreeting = useCallback((greeting: string) => {
    setMessages(prev => [...prev, { role: "assistant", content: greeting }]);
  }, []);

  return { messages, isTyping, sendMessage, setGreeting, historyLoaded: true };
}