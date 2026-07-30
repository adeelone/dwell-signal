import { beforeEach, describe, expect, it } from "vitest";
import { clearStored, readStored, writeStored } from "./storage";

describe("versioned demo storage", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips current data", () => {
    writeStored("settings", { building: "Juniper" });
    expect(readStored("settings", { building: "Fallback" })).toEqual({ building: "Juniper" });
  });

  it("ignores incompatible and malformed data", () => {
    localStorage.setItem("dwell-signal:settings", JSON.stringify({ version: 99, data: "old" }));
    expect(readStored("settings", "fallback")).toBe("fallback");
    localStorage.setItem("dwell-signal:settings", "{");
    expect(readStored("settings", "fallback")).toBe("fallback");
  });

  it("clears only DwellSignal data", () => {
    writeStored("settings", { building: "Juniper" });
    localStorage.setItem("another-app", "keep");
    clearStored();
    expect(readStored("settings", null)).toBeNull();
    expect(localStorage.getItem("another-app")).toBe("keep");
  });
});
