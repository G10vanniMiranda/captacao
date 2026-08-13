import type { OfferType } from "@/features/acquisition/content.schema";

export type QualificationReason =
  | "NEED_NOT_CONCRETE"
  | "TIMING_MISSING"
  | "INVESTMENT_MISSING"
  | "INVESTMENT_BELOW_MINIMUM";

export type QualificationRuleSet = Readonly<{
  version: string;
  currency: "BRL";
  minimumInvestmentCents: Readonly<Record<OfferType, number>>;
}>;

export type QualificationInput = Readonly<{
  offerType: OfferType;
  hasConcreteNeed: boolean;
  timing: string | null;
  investmentCents: number | null;
}>;

export type QualificationResult = Readonly<{
  qualified: boolean;
  reasons: readonly QualificationReason[];
  ruleVersion: string;
}>;
