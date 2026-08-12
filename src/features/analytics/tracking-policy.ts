export type TrackingPolicy =
  | "disabled"
  | "anonymous-approved"
  | "consent-required";

export type AnalyticsConsent = "unknown" | "granted" | "denied";

export function resolveWebAnalyticsPolicy(
  configuredPolicy: string | undefined,
): TrackingPolicy {
  if (
    configuredPolicy === "anonymous-approved" ||
    configuredPolicy === "consent-required"
  ) {
    return configuredPolicy;
  }

  return "disabled";
}

export function shouldLoadWebAnalytics(
  policy: TrackingPolicy,
  consent: AnalyticsConsent,
): boolean {
  if (policy === "disabled") return false;
  if (policy === "anonymous-approved") return true;
  return consent === "granted";
}
