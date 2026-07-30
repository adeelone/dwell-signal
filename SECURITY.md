# Security notes

## Current demo

- No secrets or credentials are required.
- No third-party requests are made by application code.
- No raw payment details are accepted.
- Production source maps are disabled.
- User-entered text renders through React, which escapes it by default.
- Request classification is local and cannot assign a technician by itself.
- Local storage failures are handled without breaking the app.

## Required before a public multi-user launch

1. Add server-enforced authentication and role authorization. Never trust a client-selected portal role.
2. Store requests, assignments, payments, and event history in a transactional database with tenant isolation.
3. Use a hosted payment page from a PCI-compliant provider. Store provider IDs and receipts, not card data.
4. Put model calls behind an authenticated server endpoint with validated input, rate limits, safe logs, and human confirmation for dispatch.
5. Add CSP, HSTS, frame protection, referrer policy, and restricted CORS at the hosting layer.
6. Encrypt sensitive records, define retention periods, and audit access to resident history.
7. Avoid automated adverse decisions from payment history. “Payment reliability” is operational context, not a screening score.

No credentials from the reference repository were copied or used.
