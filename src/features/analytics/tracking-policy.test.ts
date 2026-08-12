import { describe, expect, it } from "vitest";

import {
  resolveWebAnalyticsPolicy,
  shouldLoadWebAnalytics,
} from "@/features/analytics/tracking-policy";

describe("shouldLoadWebAnalytics", () => {
  it.each([
    ["disabled", "unknown", false],
    ["disabled", "granted", false],
    ["anonymous-approved", "unknown", true],
    ["anonymous-approved", "denied", true],
    ["consent-required", "unknown", false],
    ["consent-required", "denied", false],
    ["consent-required", "granted", true],
  ] as const)(
    "returns %s/%s as %s",
    (policy, consent, expected) => {
      expect(shouldLoadWebAnalytics(policy, consent)).toBe(expected);
    },
  );
});

describe("resolveWebAnalyticsPolicy", () => {
  it("defaults missing or invalid configuration to disabled", () => {
    expect(resolveWebAnalyticsPolicy(undefined)).toBe("disabled");
    expect(resolveWebAnalyticsPolicy("unexpected-mode")).toBe("disabled");
  });

  it.each(["disabled", "anonymous-approved", "consent-required"] as const)(
    "preserves the explicit %s policy",
    (policy) => {
      expect(resolveWebAnalyticsPolicy(policy)).toBe(policy);
    },
  );
});
