import type { BotConfig, SendChatMessageParams, CreateOrderParams, CreatedOrder } from "./types";

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:3000";

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

export async function sendChatMessage(params: SendChatMessageParams): Promise<void> {
  const res = await fetch(`${BASE_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Error enviando mensaje");
  // SSE handled by caller
}

export async function createDraftOrder(params: CreateOrderParams): Promise<CreatedOrder> {
  const res = await fetch(`${BASE_URL}/ai/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return handleResponse(res);
}