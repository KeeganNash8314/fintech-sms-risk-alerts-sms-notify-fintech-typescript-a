import test from "node:test";
import assert from "node:assert/strict";
import { decideAlert } from "../src/payment_alert.js";

test("high risk payments are held for review", () => {
  const decision = decideAlert({ payment_id: "p1", account_id: "a1", amount_cents: 100, currency: "USD", risk_score: 0.9, phone: "+15551234567" });
  assert.deepEqual(decision, { action: "hold", reason: "high risk requires review" });
});
