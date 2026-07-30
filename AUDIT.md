# Production audit

Audit started July 30, 2026 against the production-revamp prompt and the original three-portal product brief.

## Assumptions

- DwellSignal is a portfolio-ready local demo of a future multi-user service.
- A reviewer should be able to use every demo flow without accounts, keys, or setup beyond `npm install`.
- Payments, authentication, messaging, model calls, and durable shared data must not be faked. The UI must label simulations honestly.
- The existing visual direction and the three roles are product constraints.
- Static hosting is the right target for this version. A real multi-user release needs a backend and is a separate milestone.

## Inventory before changes

### Surfaces

- Role switcher: owner, technician, resident
- Shared sidebar: overview, spaces, alerts, work orders, residents, reports, settings
- Owner overview: collection summary, payment reliability, request table, technician auto-match, dispatch calendar
- Technician overview: trade filter, estimated earnings, qualified job queue, job-state actions, calendar
- Resident overview: balance and payment simulation, maintenance request form, local classification, availability, preferred technician, request timeline
- Supporting views: climate spaces, alerts, work orders, resident requests, reports/CSV export, settings
- Dialogs: alert review and work-order creation

There is no router, backend, API route, service worker, authentication layer, analytics SDK, payment SDK, or external data client.

### State and persistence

- Seed data lives in `src/data.ts` and `src/portalData.ts`.
- Mutable alerts, work orders, settings, and service requests use browser `localStorage`.
- Storage has no schema version or migration path.
- Resident inbox state is component-local and resets on reload.

### Configuration and environment

- No environment variables are read.
- Vite production source maps are disabled.
- Node support is declared as `>=20 <23`; the audit machine currently runs Node 25 and emits an engine warning.

### Tests

- `src/App.test.tsx`: three rendered integration tests for initial owner view, role switching, and resident classification.
- `src/lib/routing.test.ts`: request classification and technician ranking.
- `src/lib/comfort.test.ts`: comfort severity and score.
- No no-op or placeholder tests found.
- No end-to-end browser test committed.

### Dependencies

- Runtime: React, React DOM, Lucide React.
- Tooling: Vite, TypeScript, ESLint, Vitest, Testing Library, jsdom, coverage-v8.
- No external API, font package, or asset license dependency.

## Findings before changes

| Area                     | Status  | Finding                                                                                                                   |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| Ownership boundary       | PASS    | Fresh repository and source are independent from Nebula STAT.                                                             |
| Three role overviews     | PASS    | Owner, technician, and resident overview flows share the same request state.                                              |
| Role-specific navigation | PARTIAL | Sidebar labels and destinations are the same for all roles; several destinations are owner-oriented.                      |
| Request routing          | PASS    | Classification and technician ranking are deterministic, explained, and covered by unit tests.                            |
| Scheduling               | PARTIAL | Calendar is readable and job states advance, but cards are not directly assignable from a time slot.                      |
| Payments                 | PARTIAL | Payment is correctly a demo, but browser `alert()` is a weak confirmation and no receipt state is created.                |
| Persistence              | PARTIAL | Local storage works, but stored data is not versioned or resettable from the UI.                                          |
| Accessibility            | PARTIAL | Semantic controls are present; modals lack focus management and some buttons have no visible result.                      |
| Error handling           | PARTIAL | Storage failures are swallowed intentionally, but the app has no top-level error boundary.                                |
| Security headers         | FAIL    | No host configuration supplies CSP or the standard static security headers.                                               |
| Secret exposure          | PASS    | No runtime secrets, environment variables, endpoints, or third-party clients exist.                                       |
| Privacy and fairness     | PASS    | Privacy boundaries and non-punitive payment language are documented.                                                      |
| Humanized code           | PARTIAL | Copy is direct, but `App.tsx`, `Portals.tsx`, and the single compressed stylesheet are harder to maintain than necessary. |
| Deployment               | FAIL    | No remote, CI workflow, or live URL is configured.                                                                        |
| Repository hygiene       | PARTIAL | Generated design references and a rendered screenshot are tracked even though runtime does not use them.                  |

## Consolidation targets

1. Version the local data store and expose a safe reset action.
2. Give each role navigation labels that match its work.
3. Replace browser-alert payment feedback with in-app state and a receipt.
4. Add an error boundary and accessible modal behavior.
5. Add static-host security headers and a CI workflow.
6. Remove unused design/render artifacts from the product repository.
7. Add a discrete requirements matrix with code and test evidence.

## Deliberately outside the local pass

- Real authentication and server-enforced authorization
- Real payment collection or card handling
- Shared database, audit log, uploads, email, SMS, and calendar sync
- Model-backed classification and production dispatch
- Legally binding tenant screening or automated adverse decisions

Those features need provider selection, credentials, privacy decisions, and a backend. They must remain clearly labeled until implemented for real.

## Completion summary

- Replaced shared navigation with role-specific menus.
- Added qualified technician reassignment and scheduling inside resident access windows.
- Replaced the payment browser alert with a persistent local receipt and clear “no money moved” language.
- Versioned local storage and added a scoped reset control.
- Added an app error boundary, labeled dialogs, focus targets, numeric limits, and empty job states.
- Removed the external font request and three unused generated image artifacts.
- Added Prettier, CI, Vercel/Netlify security headers, and a security regression test.
- Expanded the suite from 7 to 15 tests before final browser QA.

Static demo readiness is PASS. Multi-user production readiness remains PARTIAL until the backend/provider work listed above is built.
