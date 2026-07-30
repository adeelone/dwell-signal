# Security notes

## Current demo

- No secrets or credentials are required.
- No third-party requests are made by application code.
- Vercel and Netlify configuration set CSP, HSTS, frame protection, MIME sniffing protection, a restrictive permissions policy, and referrer controls.
- No raw payment details are accepted.
- Production source maps are disabled.
- User-entered text renders through React, which escapes it by default.
- Request classification is local and cannot assign a technician by itself.
- Local storage failures are handled without breaking the app.
- A top-level error boundary keeps unexpected render failures from leaving a blank page.

## Audit results

- Worktree and Git history scans found no credential-shaped values. Matches were ordinary package names such as `css-tokenizer`.
- The production bundle contains no API keys, bearer credentials, private keys, or database connection strings.
- `npm audit --audit-level=high` reports zero vulnerabilities.
- Installed dependency licenses are MIT, ISC, Apache-2.0, BSD, BlueOak, CC-BY-4.0, MIT-0, and Python-2.0. No GPL, AGPL, or SSPL dependency was found.
- `src/security.test.ts` verifies that the Vercel policy keeps scripts same-origin, blocks framing and objects, and disables the browser payment permission.

## Required before a public multi-user launch

1. Add server-enforced authentication and role authorization. Never trust a client-selected portal role.
2. Store requests, assignments, payments, and event history in a transactional database with tenant isolation.
3. Use a hosted payment page from a PCI-compliant provider. Store provider IDs and receipts, not card data.
4. Put model calls behind an authenticated server endpoint with validated input, rate limits, safe logs, and human confirmation for dispatch.
5. Keep the checked-in headers enabled. The production host must remain HTTPS-only while HSTS is active; there is no API or CORS surface in this static build.
6. Encrypt sensitive records, define retention periods, and audit access to resident history.
7. Avoid automated adverse decisions from payment history. “Payment reliability” is operational context, not a screening score.

No credentials from the reference repository were copied or used.
