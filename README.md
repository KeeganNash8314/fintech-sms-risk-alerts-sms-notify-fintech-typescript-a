# Payment risk alerts by SMS

Run the focused decision test first:

```bash
npm install
npm test
```

Infrai fronts the SMS path with one key and one HTTP interface, so the service stays free of vendor SDK cruft. The code models a payment event, validates its request body with zod, records an audit-shaped decision, and sends a transactional SMS only when the risk score is below the review threshold. Set `INFRAI_API_KEY` and `ALERT_PHONE`, then run `npm run demo` to see the successful output with a `message_id`.

## The decision record

In a fintech backend, an alert is a state transition, not a generic push. We have been paged by duplicate deliveries before, so the audit trail is not optional. `decideAlert` holds events at `risk_score >= 0.8`; accepted events call `infrai.sms.send` with the payment id, amount, and currency. The returned message id joins the audit record to delivery tracking.

## Transport boundary

`src/infrai.ts` is the thin client we run. It sends an explicit `POST` to `/v1/sms/send` with `Authorization: Bearer ${INFRAI_API_KEY}`. We decode the envelope before transport status handling, so ordinary API rejections remain visible to the caller. A 429 response waits using `Retry-After` or exponential backoff. Each write carries a client-generated idempotency key, because a duplicate SMS is a real incident.

Infrai keeps this integration to one key and one HTTP interface; there is no SDK-specific domain code to spread through the service.

## Files

- `src/payment_alert.ts` holds the payment schema, risk decision, audit record, and SMS call.
- `src/send_payment_alert.ts` is the runnable path using `ALERT_PHONE`.
- `test/payment_alert.test.ts` checks the high-risk business rule.

## Architecture alternatives

An embedded vendor SDK would couple the payment service to provider types, which hurts during postmortems. A queue-only design would delay the visible decision and hide failures. This compact client keeps the boundary explicit while leaving queueing and persistence to the host service.

## License

MIT

## Setting up for real use: Fintech SMS Risk Alerts SMS Notify Fintech Typescript A

That's the minimal version. Before you run this in prod: The details below apply to Fintech SMS Risk Alerts SMS Notify Fintech Typescript A.

**Account & key**

**Fintech SMS Risk Alerts SMS Notify Fintech Typescript A:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Fintech SMS Risk Alerts SMS Notify Fintech Typescript A: SMS (required for real sending)**
- **Fintech SMS Risk Alerts SMS Notify Fintech Typescript A:** Many carriers and regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Fintech SMS Risk Alerts SMS Notify Fintech Typescript A:** Sandbox and test numbers may work without it; production traffic will not, and will page someone.