import type { BotConfig, SendChatMessageParams, CreateOrderParams, CreatedOrder, SseEventData } from "./types";

const BASE_URL = (import.meta.env as unknown as { VITE_API_URL?: string }).VITE_API_URL ?? "http://localhost:3000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? `Error ${res.status}`);
  }
  return res.json();
}

export async function getBotConfig(slug: string, botKey: string): Promise<BotConfig> {
  const res = await fetch(`${BASE_URL}/ai/config?slug=${encodeURIComponent(slug)}&botKey=${encodeURIComponent(botKey)}`);
  return handleResponse(res);
}

function parseSseChunk(chunk: string): { event: string; data: SseEventData } | null {
  let event = "";
  let dataStr = "";
  for (const line of chunk.split("\n")) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataStr = line.slice(5).trim();
    }
  }
  if (!event) return null;
  try {
    return { event, data: dataStr ? JSON.parse(dataStr) : {} };
  } catch {
    return null;
  }
}

export async function sendChatMessage(params: SendChatMessageParams): Promise<void> {
  const res = await fetch(`${BASE_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Error enviando mensaje");

  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() ?? "";
    for (const chunk of lines) {
      const parsed = parseSseChunk(chunk);
      if (!parsed) continue;
      const { event, data } = parsed;
      switch (event) {
        case "text":
          params.onText?.(data.content ?? "");
          break;
        case "text_reset":
          params.onTextReset?.();
          break;
        case "tool_call":
          params.onToolCall?.(data.toolName ?? "");
          break;
        case "order":
          params.onOrder?.({
            publicCode: data.publicCode ?? "",
            total: data.total ?? 0,
            items: (data.items ?? []).map(i => ({ name: i.name, quantity: i.quantity, unitPrice: i.unitPrice ?? 0, subtotal: i.subtotal })),
          });
          break;
        case "customer":
          params.onCustomer?.({
            publicCode: data.publicCode ?? "",
            customerName: data.customerName ?? null,
            paymentIntent: data.paymentIntent ?? null,
          });
          break;
        case "done":
          params.onDone?.();
          return;
        case "error":
          params.onError?.(data.message ?? "Error desconocido");
          return;
      }
    }
  }
}

export async function createDraftOrder(params: CreateOrderParams): Promise<CreatedOrder> {
  const res = await fetch(`${BASE_URL}/ai/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return handleResponse(res);
}