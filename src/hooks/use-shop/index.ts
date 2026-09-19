import { useEffect, useState } from "react";
import { getBotConfig } from "../../api/bot/bot";
import type { BotConfig } from "../../api/bot/types";

export function useShop(slug: string, botKey: string) {
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !botKey) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const cfg = await getBotConfig(slug, botKey);
        if (!cancelled) {
          setConfig(cfg);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.response?.data?.message ?? "No pudimos cargar el negocio");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug, botKey]);

  return { config, loading, error };
}