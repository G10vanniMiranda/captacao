import { describe, expect, it } from "vitest";

import { evaluateQualification } from "@/features/qualification/evaluate";
import {
  defineQualificationRuleSet,
  qualificationRulesV1,
} from "@/features/qualification/rules";

describe("qualificationRulesV1", () => {
  it("contains the approved immutable BRL thresholds", () => {
    expect(qualificationRulesV1).toMatchObject({
      version: "qualification-v1",
      currency: "BRL",
      minimumInvestmentCents: {
        SITE: 300_000,
        SYSTEM: 1_000_000,
      },
    });
    expect(Object.isFrozen(qualificationRulesV1)).toBe(true);
    expect(Object.isFrozen(qualificationRulesV1.minimumInvestmentCents)).toBe(
      true,
    );
  });

  it.each([-1, 10.5])(
    "rejects the invalid minimum investment %s",
    (invalidMinimum) => {
      expect(() =>
        defineQualificationRuleSet({
          version: "qualification-invalid-v1",
          currency: "BRL",
          minimumInvestmentCents: {
            SITE: invalidMinimum,
            SYSTEM: 1,
          },
        }),
      ).toThrow(/non-negative integer/i);
    },
  );
});

describe("evaluateQualification", () => {
  it.each([
    ["SITE", qualificationRulesV1.minimumInvestmentCents.SITE],
    ["SYSTEM", qualificationRulesV1.minimumInvestmentCents.SYSTEM],
  ] as const)(
    "qualifies %s at its inclusive minimum of %i cents",
    (offerType, investmentCents) => {
      expect(
        evaluateQualification(
          {
            offerType,
            hasConcreteNeed: true,
            timing: "WITHIN_90_DAYS",
            investmentCents,
          },
          qualificationRulesV1,
        ),
      ).toEqual({
        qualified: true,
        reasons: [],
        ruleVersion: "qualification-v1",
      });
    },
  );

  it("returns every applicable reason in stable order", () => {
    expect(
      evaluateQualification(
        {
          offerType: "SYSTEM",
          hasConcreteNeed: false,
          timing: null,
          investmentCents:
            qualificationRulesV1.minimumInvestmentCents.SYSTEM - 1,
        },
        qualificationRulesV1,
      ),
    ).toEqual({
      qualified: false,
      reasons: [
        "NEED_NOT_CONCRETE",
        "TIMING_MISSING",
        "INVESTMENT_BELOW_MINIMUM",
      ],
      ruleVersion: "qualification-v1",
    });
  });

  it("keeps missing timing and investment as explicit non-qualification reasons", () => {
    expect(
      evaluateQualification(
        {
          offerType: "SITE",
          hasConcreteNeed: true,
          timing: null,
          investmentCents: null,
        },
        qualificationRulesV1,
      ),
    ).toEqual({
      qualified: false,
      reasons: ["TIMING_MISSING", "INVESTMENT_MISSING"],
      ruleVersion: "qualification-v1",
    });
  });

  it("retains the rule version when versions classify the same input differently", () => {
    const lowerThresholdRules = defineQualificationRuleSet({
      version: "qualification-test-v2",
      currency: "BRL",
      minimumInvestmentCents: { SITE: 200_000, SYSTEM: 900_000 },
    });
    const input = {
      offerType: "SITE",
      hasConcreteNeed: true,
      timing: "WITHIN_90_DAYS",
      investmentCents: 250_000,
    } as const;

    expect(evaluateQualification(input, qualificationRulesV1)).toEqual({
      qualified: false,
      reasons: ["INVESTMENT_BELOW_MINIMUM"],
      ruleVersion: "qualification-v1",
    });
    expect(evaluateQualification(input, lowerThresholdRules)).toEqual({
      qualified: true,
      reasons: [],
      ruleVersion: "qualification-test-v2",
    });
  });
});
