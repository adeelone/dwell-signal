import type { ServiceRequest, Technician, Trade } from "../types";

const rules: Array<[Trade, RegExp]> = [
  ["Life safety", /\b(smoke|carbon monoxide|co alarm|sprinkler|fire)\b/i],
  ["Plumbing", /\b(leak|faucet|toilet|drain|pipe|water)\b/i],
  ["Electrical", /\b(outlet|breaker|power|light|electrical|spark)\b/i],
  ["HVAC", /\b(ac|air condition|heat|thermostat|warm|cold|airflow)\b/i],
  ["Appliance", /\b(dishwasher|oven|fridge|refrigerator|washer|dryer)\b/i],
  ["Locksmith", /\b(lock|key|door won.?t lock)\b/i],
  ["Pest control", /\b(roaches|ants|mice|pest|insect|rodent)\b/i],
  ["Landscaping", /\b(lawn|tree|yard|irrigation|landscap)\b/i],
  ["Inspection", /\b(appraisal|inspect|valuation)\b/i],
];

export function classifyRequest(text: string): { trade: Trade; confidence: number } {
  const hit = rules.find(([, pattern]) => pattern.test(text));
  return hit ? { trade: hit[0], confidence: 94 } : { trade: "General repair", confidence: 68 };
}

export function rankTechnicians(
  request: Pick<ServiceRequest, "trade" | "availability" | "preferredTechnician">,
  technicians: Technician[],
): Technician[] {
  return technicians
    .filter((tech) => tech.trades.includes(request.trade))
    .map((tech) => ({
      tech,
      score:
        tech.rating * 10 -
        tech.jobsThisWeek * 2 +
        (tech.available.some((slot) => request.availability.includes(slot)) ? 20 : 0) +
        (tech.name === request.preferredTechnician ? 15 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ tech }) => tech);
}
