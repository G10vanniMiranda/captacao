import type { QualificationRuleSet } from "@/features/qualification/types";

export function defineQualificationRuleSet<
  const T extends QualificationRuleSet,
>(rules: T): T {
  for (const minimum of Object.values(rules.minimumInvestmentCents)) {
    if (!Number.isSafeInteger(minimum) || minimum < 0) {
      throw new Error("Minimum investment must be a non-negative integer");
    }
  }

  return Object.freeze({
    ...rules,
    minimumInvestmentCents: Object.freeze({
      ...rules.minimumInvestmentCents,
    }),
  }) as T;
}

export const qualificationRulesV1 = defineQualificationRuleSet({
  version: "qualification-v1",
  currency: "BRL",
  minimumInvestmentCents: {
    SITE: 300_000,
    SYSTEM: 1_000_000,
  },
});
