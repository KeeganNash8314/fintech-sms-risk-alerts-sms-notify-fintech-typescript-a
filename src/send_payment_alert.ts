import { processPaymentAlert } from "./payment_alert.js";

const phone = process.env.ALERT_PHONE;
if (!phone) throw new Error("ALERT_PHONE is required");
const result = await processPaymentAlert({ payment_id: "pay_demo_001", account_id: "acct_demo", amount_cents: 12500, currency: "USD", risk_score: 0.12, phone });
console.log(JSON.stringify(result, null, 2));
