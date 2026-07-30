import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("static hosting security", () => {
  it("ships a restrictive content security policy", () => {
    const config = JSON.parse(readFileSync("vercel.json", "utf8")) as {
      headers: Array<{ headers: Array<{ key: string; value: string }> }>;
    };
    const headers = new Map(config.headers[0].headers.map((header) => [header.key, header.value]));
    const policy = headers.get("Content-Security-Policy");

    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("object-src 'none'");
    expect(headers.get("Strict-Transport-Security")).toContain("max-age=31536000");
    expect(headers.get("Permissions-Policy")).toContain("payment=()");
  });
});
