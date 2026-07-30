import { describe, expect, it } from "vitest";
import { classifyRequest, rankTechnicians } from "./routing";
import { technicians } from "../portalData";

describe("request routing", () => {
  it("classifies common maintenance descriptions", () => {
    expect(classifyRequest("the kitchen faucet is leaking").trade).toBe("Plumbing");
    expect(classifyRequest("the outlet has no power").trade).toBe("Electrical");
    expect(classifyRequest("smoke alarm keeps chirping").trade).toBe("Life safety");
  });
  it("uses qualification, availability, workload, and preference when ranking", () => {
    const ranked = rankTechnicians(
      { trade: "HVAC", availability: ["Mon 9–1"], preferredTechnician: "Marcus Hill" },
      technicians,
    );
    expect(ranked[0].name).toBe("Marcus Hill");
    expect(ranked.every((tech) => tech.trades.includes("HVAC"))).toBe(true);
  });
});
