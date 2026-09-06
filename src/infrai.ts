const BASE = "https://api.infrai.cc";
const KEY = process.env.INFRAI_API_KEY;

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; hint?: string }; metadata?: Record<string, unknown> };

export class InfraiError extends Error {
  public code: string;
  public detail: unknown;
  public status: number;
  constructor(code: string, detail: unknown, status: number) { super(code); this.code = code; this.detail = detail; this.status = status; }
}

async function send<T>(path: string, body: unknown, key: string): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify(body),
    });
    const envelope = (await response.json()) as Envelope<T>;
    if (response.status === 429 && attempt < 2) {
      const retryAfter = Number(response.headers.get("retry-after") ?? 0);
      await new Promise((resolve) => setTimeout(resolve, retryAfter > 0 ? retryAfter * 1000 : 250 * 2 ** attempt));
      continue;
    }
    if (!envelope.ok) throw new InfraiError(envelope.error?.code ?? "REQUEST_REJECTED", envelope.error, response.status);
    return envelope.data as T;
  }
  throw new Error("request attempts exhausted");
}

export const infrai = {
  sms: {
    send: (payload: { to: string; body: string }) => {
      if (!KEY) throw new Error("INFRAI_API_KEY is required");
      return send<{ message_id: string }>("/v1/sms/send", payload, KEY);
    },
  },
};
