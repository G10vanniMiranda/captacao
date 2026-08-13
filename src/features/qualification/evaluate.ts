import type {
  QualificationInput,
  QualificationReason,
  QualificationResult,
  QualificationRuleSet,
} from "@/features/qualification/types";

export function evaluateQualification(
  input: QualificationInput,
  rules: QualificationRuleSet,
): QualificationResult {
  const reasons: QualificationReason[] = [];

  if (!input.hasConcreteNeed) reasons.push("NEED_NOT_CONCRETE");
  if (input.timing === null) reasons.push("TIMING_MISSING");

  if (input.investmentCents === null) {
    reasons.push("INVESTMENT_MISSING");
  } else if (
    input.investmentCents <
    rules.minimumInvestmentCents[input.offerType]
  ) {
    reasons.push("INVESTMENT_BELOW_MINIMUM");
  }

  return Object.freeze({
    qualified: reasons.length === 0,
    reasons: Object.freeze(reasons),
    ruleVersion: rules.version,
  });
}
