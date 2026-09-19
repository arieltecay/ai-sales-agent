import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useShop } from "../../hooks/use-shop";
import { useChat } from "../../hooks/use-chat";
import { useCart } from "../../hooks/use-cart";
import { useOrderConfirm } from "../../hooks/use-order-confirm";
import { getOrCreateSessionId } from "../../lib/session";
import { ShopHeader } from "../../components/shop-header";
import { ChatLoadingState } from "./components/chat-loading-state";
import { ChatErrorState } from "./components/chat-error-state";
import { ChatThread } from "./components/chat-thread";
import { ChatDock } from "./components/chat-dock";
import { OrderSection } from "./components/order-section";
import { ChatOfflineState } from "./components/chat-offline-state";

export default function ChatPage() {
  const { slug = "" } = useParams();
  const [searchParams] = useSearchParams();
  const botKey = searchParams.get("key") ?? "";

  const { config, loading, error } = useShop(slug, botKey);
  const { messages, isTyping, sendMessage, setGreeting, historyLoaded } = useChat({
    slug,
    botKey,
    sessionId: getOrCreateSessionId(),
    businessName: config?.businessName,
    onOrder: (llmOrder) => {
      orderConfirm.adoptLlmOrder(llmOrder.publicCode, llmOrder.total, llmOrder.items.map(i => ({ name: i.name, quantity: i.quantity, subtotal: i.subtotal })));
    },
    onCustomer: (customer) => {
      orderConfirm.applyLlmCustomerUpdate(customer);
    },
  });
  const cart = useCart();
  const [sheetOpen, setSheetOpen] = useState(false);
  const orderConfirm = useOrderConfirm({ slug, botKey, sessionId: getOrCreateSessionId() });

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [messages, isTyping]);

  useEffect(() => {
    // El saludo solo va en chats nuevos: si el effect de historial cargó
    // mensajes previos, el cliente retoma donde dejó.
    if (config && config.available && messages.length === 0 && historyLoaded) {
      setGreeting(config.greeting);
    }
  }, [config, messages.length === 0, historyLoaded, setGreeting]);
  if (loading) return <ChatLoadingState />;
  if (error || !config) return <ChatErrorState message={error ?? "Negocio no disponible"} />;

  // Offline mode: bot deshabilitado pero escuela existe
  if (config && !config.available) {
    return <ChatOfflineState businessName={config.businessName} />;
  }

  const onlineConfig = config as { available: true; businessName: string; greeting: string; quickReplies: string[]; whatsappNumber: string; transferInfo: { alias: string; cbu: string } | null };

  return (
    <div className="min-h-screen bg-canvas">
      <ShopHeader businessName={onlineConfig.businessName} />
      <ChatThread
        quickReplies={onlineConfig.quickReplies}
        messages={messages}
        isTyping={isTyping}
        order={orderConfirm.order}
        paymentIntent={orderConfirm.order?.paymentIntent ?? null}
        onPaymentIntent={intent => void orderConfirm.setPaymentIntent(intent)}
        onQuickReply={text => void sendMessage(text)}
        transferInfo={onlineConfig.transferInfo}
        paidNotice={orderConfirm.paidNotice}
        onMarkPaid={() => void orderConfirm.markPaid()}
      />
      <ChatDock
        showPeekBar={!cart.isEmpty && !orderConfirm.order && !sheetOpen}
        itemCount={cart.itemCount}
        total={cart.total}
        isTyping={isTyping}
        order={orderConfirm.order}
        onExpand={() => setSheetOpen(true)}
        onSend={text => void sendMessage(text)}
      />
      <OrderSection
        sheetOpen={sheetOpen}
        order={orderConfirm.order}
        confirming={orderConfirm.confirming}
        error={orderConfirm.error}
        onCollapse={() => setSheetOpen(false)}
        onConfirm={customerName => void orderConfirm.confirmOrder(customerName)}
      />
    </div>
  );
}