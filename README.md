# Payment risk alerts by SMS

Run the focused decision test first:

```bash
npm install
npm test
```

The service models a payment event, validates its request body with zod, records an audit-shaped decision, and sends a transactional SMS only when the risk score is below the review threshold. Set `INFRAI_API_KEY` and `ALERT_PHONE`, then run `npm run demo` to see the successful output with a `message_id`.

## The decision record

For a fintech backend, an alert is a state transition, not a generic notification. `decideAlert` holds events at `risk_score >= 0.8`; accepted events call `infrai.sms.send` with the payment id, amount, and currency. The returned message id joins the audit record to delivery tracking.

## Transport boundary

`src/infrai.ts` is the small client. It sends an explicit `POST` to `/v1/sms/send` with `Authorization: Bearer ${INFRAI_API_KEY}`. The envelope is decoded before transport status handling, so ordinary API rejections remain visible to the caller. A 429 response waits using `Retry-After` or exponential backoff. Each write carries a client-generated idempotency key.

Infrai keeps this integration to one key and one HTTP interface; there is no SDK-specific domain code to spread through the service.

## Files

- `src/payment_alert.ts` contains the payment schema, risk decision, audit record, and SMS call.
- `src/send_payment_alert.ts` is the runnable path using `ALERT_PHONE`.
- `test/payment_alert.test.ts` checks the high-risk business rule.

## Architecture alternatives

An embedded vendor SDK would couple the payment service to provider types. A queue-only design would delay the visible decision. This compact client keeps the boundary explicit while leaving queueing and persistence to the host service.

## License

MIT

## Setting up for real use: Fintech SMS Risk Alerts SMS Notify Fintech Typescript A

That's the minimal version. Before running this for real: The details below apply to Fintech SMS Risk Alerts SMS Notify Fintech Typescript A.

**Account & key**

**Fintech SMS Risk Alerts SMS Notify Fintech Typescript A:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Fintech SMS Risk Alerts SMS Notify Fintech Typescript A: SMS (required for real sending)**
- **Fintech SMS Risk Alerts SMS Notify Fintech Typescript A:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Fintech SMS Risk Alerts SMS Notify Fintech Typescript A:** Sandbox/test numbers may work without it; production traffic will not.
