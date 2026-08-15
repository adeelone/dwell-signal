# DwellSignal

[![CI](https://github.com/adeelone/dwell-signal/actions/workflows/ci.yml/badge.svg)](https://github.com/adeelone/dwell-signal/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-18-149ECA?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**One shared property-operations workflow for owners, service professionals, and residents.**

DwellSignal is a role-based property operations app for owners, technicians, and residents. All three portals share one request lifecycle: a resident reports an issue and provides availability, the routing assistant suggests a trade and ranks qualified technicians, a technician accepts and schedules the job, and the owner can follow or adjust the assignment.

This repository is an original project. It does not share source, branding, credentials, or Git history with Nebula STAT.

## Why DwellSignal

Property maintenance usually fragments resident reports, owner oversight, and technician scheduling across separate tools. DwellSignal demonstrates how one request can move from plain-language intake to trade classification, qualified matching, scheduling, progress updates, and owner visibility without hiding the decision process.

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

## Project status

DwellSignal is a polished local-first product demo, not a production property-management service. Authentication, shared cloud data, real payments, messaging, and model-backed routing are deliberately documented as future backend work.
