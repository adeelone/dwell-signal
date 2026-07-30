import { describe, expect, it } from "vitest";
import { comfortScore, comfortSeverity } from "./comfort";
import type { Zone } from "../types";

const zone = (temperature: number, setpoint = 72): Zone => ({
  id: "x",
  name: "X",
  floor: "1",
  type: "Office",
  temperature,
  setpoint,
  occupancy: 1,
  humidity: 40,
  trend: [temperature],
});

describe("comfort calculations", () => {
  it("ranks meaningful setpoint differences", () => {
    expect(comfortSeverity(zone(72.5))).toBe("info");
    expect(comfortSeverity(zone(74))).toBe("attention");
    expect(comfortSeverity(zone(77))).toBe("critical");
  });
  it("returns a bounded aggregate score", () => {
    expect(comfortScore([zone(72), zone(74)])).toBe(97);
    expect(comfortScore([])).toBe(0);
  });
});
