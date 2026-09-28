import { useState } from "react";
import type { OrderDisplay } from "./types";

interface OrderSectionProps {
  sheetOpen: boolean;
  order: OrderDisplay | null;
  confirming: boolean;
  error: string | null;
  onCollapse: () => void;
  onConfirm: (_customerName: string) => void;
}

export const OrderSection = ({ sheetOpen, order, confirming, error, onCollapse, onConfirm }: OrderSectionProps) => {
  const [customerName, setCustomerName] = useState("");

  if (!sheetOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center sm:justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-xl shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Confirmar pedido</h2>
          <button onClick={onCollapse} className="p-2 rounded-lg hover:bg-neutral-100">
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            {order.items.map((item: { name: string; quantity: number; subtotal: number }, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>${item.subtotal.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>${order.total.toLocaleString()}</span>
          </div>
          {!order.paymentIntent && (
            <div className="space-y-3">
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Nombre para el pedido"
                className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400"
              />
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { order.paymentIntent = "cash"; }} className="py-2 bg-primary-600 text-white rounded-lg">Efectivo</button>
                <button onClick={() => { order.paymentIntent = "transfer"; }} className="py-2 bg-primary-600 text-white rounded-lg">Transferencia</button>
              </div>
            </div>
          )}
          {order.paymentIntent && !order.customerName && (
            <div className="space-y-3">
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Nombre para el pedido"
                className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400"
              />
              <button onClick={() => onConfirm(customerName)} disabled={confirming || !customerName.trim()} className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed">
                {confirming ? "Confirmando..." : "Confirmar pedido"}
              </button>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
          )}
          {order.paymentIntent && order.customerName && (
            <div className="space-y-3">
              <p className="text-center text-sm text-neutral-600">Pedido confirmado a nombre de <strong>{order.customerName}</strong>. Pago: {order.paymentIntent === "cash" ? "Efectivo" : "Transferencia"}.</p>
              <button onClick={onCollapse} className="w-full py-3 bg-neutral-100 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-200">Cerrar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};