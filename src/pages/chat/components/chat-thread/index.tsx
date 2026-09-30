interface ChatThreadProps {
  quickReplies: string[];
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  isTyping: boolean;
  order: { publicCode: string; total: number; items: Array<{ name: string; quantity: number; subtotal: number }> } | null;
  paymentIntent: "cash" | "transfer" | null;
  onPaymentIntent: (_intent: "cash" | "transfer") => void;
  onQuickReply: (_text: string) => void;
  transferInfo: { alias: string; cbu: string } | null;
  paidNotice: string | null;
  onMarkPaid: () => void;
}

export const ChatThread = ({ quickReplies, messages, isTyping, order, paymentIntent, onPaymentIntent, onQuickReply, paidNotice, onMarkPaid }: ChatThreadProps) => (
  <main className="flex-1 px-4 py-4 overflow-y-auto flex flex-col">
    {/* Quick Replies - fijo arriba del chat */}
    {quickReplies.length > 0 && (
      <div className="max-w-md mx-auto w-full mb-4 sticky top-0 bg-canvas z-10 py-2">
        <div className="flex flex-wrap gap-2 justify-center">
          {quickReplies.map((reply, i) => (
            <button key={i} onClick={() => onQuickReply(reply)} className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors">
              {reply}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Mensajes scrolleables */}
    <div className="max-w-md mx-auto space-y-4 flex-1 w-full">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.role === "user" ? "bg-primary-600 text-white rounded-br-none" : "bg-white text-neutral-900 border border-neutral-200 rounded-bl-none"}`}>
            <p className="text-sm">{msg.content}</p>
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-white text-neutral-900 border border-neutral-200 rounded-2xl rounded-bl-none px-4 py-2.5">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}
      {order && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
          <h3 className="font-semibold text-primary-800 mb-2">Pedido {order.publicCode}</h3>
          <ul className="space-y-1 mb-3">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>${item.subtotal.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold text-primary-800 mb-4">
            <span>Total</span>
            <span>${order.total.toLocaleString()}</span>
          </div>
          {!paymentIntent && (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => onPaymentIntent("cash")} className="py-2 bg-primary-600 text-white rounded-lg text-sm">Efectivo</button>
              <button onClick={() => onPaymentIntent("transfer")} className="py-2 bg-primary-600 text-white rounded-lg text-sm">Transferencia</button>
            </div>
          )}
          {paymentIntent && !paidNotice && (
            <p className="text-sm text-primary-700">Pago: {paymentIntent === "cash" ? "Efectivo" : "Transferencia"}</p>
          )}
          {paidNotice && (
            <button onClick={onMarkPaid} className="w-full py-2 bg-green-600 text-white rounded-lg text-sm">{paidNotice}</button>
          )}
        </div>
      )}
    </div>
  </main>
);