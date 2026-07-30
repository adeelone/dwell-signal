# Requirements audit

Source of truth: the user's three-portal product brief, followed by the two audit prompts for production, security, testing, humanization, and delivery requirements.

This file records the final verified state after the production and humanization passes.

| Requirement                                                                       | Result  | Evidence / boundary                                                                                          |
| --------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| Independent project and repository                                                | PASS    | Fresh Git history and original DwellSignal source; publication is tracked separately below.                  |
| Owner has property, payment, request, people, reporting, and scheduling views     | PASS    | Owner-specific navigation and supporting screens cover the requested operational areas.                      |
| Technicians see identity, qualifications, pay, orders, availability, and calendar | PASS    | Technician portal exposes trade profile, earnings, jobs, availability, and scheduled work.                   |
| Multiple technician trade categories, including appraisal/inspection              | PASS    | Ten `Trade` values and technician qualifications are modeled.                                                |
| Residents can pay, request service, provide access windows, and track work        | PASS    | Payment creates an explicit local demo receipt; service and availability flows update shared state.          |
| Resident preference informs but does not control assignment                       | PASS    | Preference is optional and only adds ranking weight for qualified technicians.                               |
| Request is classified and routed to a qualified available technician              | PASS    | `classifyRequest` and `rankTechnicians` implement and test the pipeline.                                     |
| Owner can observe and override assignment                                         | PASS    | Qualified technician selection supports explicit reassignment and best-match restoration.                    |
| Technician can accept, schedule, start, and complete work                         | PASS    | Job actions advance shared state and add an overlapping resident window to the calendar.                     |
| Calendar supports useful scheduling workflow                                      | PASS    | Owners can select resident-provided slots and technicians can add accepted work to their calendar.           |
| Payment reliability is visible without unfair hidden scoring                      | PASS    | Owner view uses descriptive categories; privacy docs reject hidden screening.                                |
| Tenant- versus building-responsibility issues are distinguished                   | PASS    | Request model and owner table expose responsibility.                                                         |
| Empty, error, and loading states are honest                                       | PASS    | Role empty states, persistent confirmations, and an app-level recovery boundary are present.                 |
| Works without secrets or paid services                                            | PASS    | Local-first demo has no external clients or required environment variables.                                  |
| Production security headers                                                       | PASS    | Vercel and static-host policies provide CSP, HSTS, isolation, framing, MIME, referrer, and permission rules. |
| Dependency and secret audits                                                      | PASS    | Zero high-severity npm findings; worktree, history, bundle, and license findings are recorded.               |
| Human, maintainable code and copy                                                 | PASS    | Prettier, ESLint, role-focused components, direct copy, and documented demo boundaries are enforced.         |
| Real automated tests for core flows                                               | PASS    | Fifteen tests cover rendered role flows, storage, routing, comfort, and security configuration.              |
| Desktop and mobile browser QA                                                     | PARTIAL | Component behavior is verified; the in-app browser webview did not attach for a final visual pass.           |
| Production-ready multi-user backend                                               | PARTIAL | Deliberately excluded: real auth, database, payment processing, and server-side AI require cloud services.   |
| Deployment and live verification                                                  | PENDING | Updated after the publication and deployment attempt.                                                        |
