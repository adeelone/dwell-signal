import type { Severity, Zone } from "../types";

export function comfortSeverity(zone: Zone): Severity {
  const difference = Math.abs(zone.temperature - zone.setpoint);
  if (difference >= 5) return "critical";
  if (difference >= 2) return "attention";
  return "info";
}

export function comfortScore(items: Zone[]): number {
  if (!items.length) return 0;
  const penalty = items.reduce(
    (sum, zone) => sum + Math.min(20, Math.abs(zone.temperature - zone.setpoint) * 3),
    0,
  );
  return Math.max(0, Math.round(100 - penalty / items.length));
}
