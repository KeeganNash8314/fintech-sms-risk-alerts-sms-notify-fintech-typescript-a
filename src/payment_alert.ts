import { z } from "zod";
import { infrai } from "./infrai.js";

export const PaymentEvent = z.object({
  payment_id: z.string().min(1),
  account_id: z.string().min(1),
  amount_cents: z.number().int().positive(),
  currency: z.string().length(3),
  risk_score: z.number().min(0).max(1),
  phone: z.string().min(7),
});
export type PaymentEvent = z.infer<typeof PaymentEvent>;

export type AlertDecision = { action: "send" | "hold"; reason: string };

export function decideAlert(event: PaymentEvent): AlertDecision {
  if (event.risk_score >= 0.8) return { action: "hold", reason: "high risk requires review" };
  return { action: "send", reason: "payment accepted" };
}

export async function processPaymentAlert(input: unknown) {
  const event = PaymentEvent.parse(input);
  const decision = decideAlert(event);
  const audit = { payment_id: event.payment_id, account_id: event.account_id, decision: decision.action, reason: decision.reason };
  if (decision.action === "hold") return { audit, message_id: null };
  const result = await infrai.sms.send({ to: event.phone, body: `Payment ${event.payment_id} approved: ${(event.amount_cents / 100).toFixed(2)} ${event.currency}.` });
  return { audit, message_id: result.message_id };
}
