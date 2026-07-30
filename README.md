# DwellSignal

DwellSignal is a role-based property operations app for owners, technicians, and residents. All three portals share one request lifecycle: a resident reports an issue and provides availability, the routing assistant suggests a trade and ranks qualified technicians, a technician accepts and schedules the job, and the owner can follow or adjust the assignment.

This repository is an original project. It does not share source, branding, credentials, or Git history with Nebula STAT.

## What works

- Owner portfolio view with rent collection, payment reliability, technician matching, reassignment, and time-slot scheduling
- Technician workbench with trade filters, qualified job offers, estimated pay, availability, scheduling, and completion
- Resident portal with a payment receipt demo, maintenance intake, local request classification, availability windows, technician preference, and request tracking
- Ten service trades: HVAC, plumbing, electrical, appliance, general repair, inspection/appraisal, landscaping, pest control, locksmith, and life safety
- Building comfort, alerts, spaces, work orders, resident inbox, reports, CSV export, and settings
- Browser-local persistence. The demo works without an account, API key, or hosted database.

The “AI” routing in this version is a transparent local rules engine. It is useful for demonstrating and testing the workflow, but it does not call a model or make a final assignment. Owners remain responsible for confirming matches.

## Run it

Requires Node 20 or 22.

```powershell
npm.cmd install
npm.cmd run dev
```

Then open the local URL Vite prints.

## Check it

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

## Data and payments

Demo changes are saved in versioned `localStorage` records and can be reset from Settings. “Record demo payment” creates a local receipt only; it does not move money. No payment processor, messaging provider, cloud database, or model provider is connected.

See [SECURITY.md](SECURITY.md), [PRIVACY.md](PRIVACY.md), and [AUDIT.md](AUDIT.md) for production boundaries.
