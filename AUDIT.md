# Build audit

## Reference boundary

Nebula STAT was reviewed only to understand the original idea: a smart thermostat dashboard, maintenance alerts, resident support, Supabase, n8n, and notification hooks. Its local checkout belongs to another GitHub owner and contains team work. DwellSignal was therefore created in a new folder with new branding, new architecture, new source, and fresh Git history.

## Product inventory

- Three portal roles: owner, technician, resident
- Shared service-request lifecycle and event state
- Ten technician trade categories
- Deterministic request classification and technician ranking
- Rent collection and payment reliability views
- Technician pay estimates and qualified job queue
- Resident payment demo, request intake, availability, and preference
- Dispatch calendar
- Comfort dashboard, zones, alerts, work orders, resident inbox, reports, settings
- CSV export and local persistence

## Production gaps

- Authentication and role authorization need a real identity provider.
- Payments need a PCI-compliant hosted checkout; raw card data must never pass through this app.
- Durable multi-user state needs a database and server-side audit log.
- Routing needs server-side model integration, evaluation, human confirmation, rate limits, and monitoring before it can be called AI-assisted in production.
- Calendar drag-and-drop is represented as a schedule board, but assignments currently advance through explicit buttons.
- Browser notifications, email, and SMS are not connected.

These are documented gaps, not hidden stubs. The local demo does not pretend to perform cloud actions.
