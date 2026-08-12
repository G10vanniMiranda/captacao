import type { RequestContext } from "@/lib/observability/request-context";

type LogFieldKey =
  | "route"
  | "outcome"
  | "durationMs"
  | "pageId"
  | "intentId"
  | "offerType"
  | "eventType"
  | "errorCode";

type LogFieldValue = string | number | boolean | null;

export type LogFields = Partial<Record<LogFieldKey, LogFieldValue>>;

const ALLOWED_FIELD_KEYS = new Set<LogFieldKey>([
  "route",
  "outcome",
  "durationMs",
  "pageId",
  "intentId",
  "offerType",
  "eventType",
  "errorCode",
]);

function validateFields(fields: LogFields | undefined): void {
  if (!fields) return;

  for (const [key, value] of Object.entries(fields)) {
    if (
      !ALLOWED_FIELD_KEYS.has(key as LogFieldKey) ||
      (value !== null && !["string", "number", "boolean"].includes(typeof value))
    ) {
      throw new Error(`Unsafe log field: ${key}`);
    }
  }
}

export function logInfo(
  context: RequestContext,
  event: string,
  fields?: LogFields,
): void {
  validateFields(fields);
  console.info(JSON.stringify({ level: "info", event, requestId: context.requestId, ...fields }));
}

export function logError(
  context: RequestContext,
  event: string,
  errorCode: string,
  fields?: LogFields,
): void {
  validateFields(fields);
  console.error(
    JSON.stringify({
      level: "error",
      event,
      requestId: context.requestId,
      ...fields,
      errorCode,
    }),
  );
}
