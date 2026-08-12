import { afterEach, describe, expect, it, vi } from "vitest";

import { logError, logInfo } from "@/lib/observability/logger";

const context = {
  requestId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  startedAt: 1_723_456_789_000,
} as const;

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("emits an info JSON line with its safe structured fields", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);

    logInfo(context, "lead.created", {
      route: "/api/leads",
      outcome: "accepted",
      durationMs: 42,
      pageId: null,
    });

    expect(info).toHaveBeenCalledOnce();
    expect(JSON.parse(String(info.mock.calls[0][0]))).toEqual({
      level: "info",
      event: "lead.created",
      requestId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      route: "/api/leads",
      outcome: "accepted",
      durationMs: 42,
      pageId: null,
    });
  });

  it("emits an error JSON line with its error code and safe structured fields", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    logError(context, "lead.rejected", "VALIDATION_FAILED", {
      intentId: "newsletter",
      offerType: "ebook",
      eventType: "form_submit",
    });

    expect(error).toHaveBeenCalledOnce();
    expect(JSON.parse(String(error.mock.calls[0][0]))).toEqual({
      level: "error",
      event: "lead.rejected",
      requestId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      errorCode: "VALIDATION_FAILED",
      intentId: "newsletter",
      offerType: "ebook",
      eventType: "form_submit",
    });
  });

  it.each(["email", "phone", "answers", "cookie", "token", "campaignRaw"]) (
    "rejects the unsafe %s field before emitting a log line",
    (unsafeField) => {
      const info = vi.spyOn(console, "info").mockImplementation(() => undefined);

      expect(() => logInfo(context, "lead.created", { [unsafeField]: "private" })).toThrow(
        /unsafe log field/i,
      );
      expect(info).not.toHaveBeenCalled();
    },
  );

  it("rejects an unsafe error field before emitting an error log line", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const unsafeFields = { email: "private" };

    expect(() => logError(context, "lead.rejected", "VALIDATION_FAILED", unsafeFields as never)).toThrow(
      /unsafe log field/i,
    );
    expect(error).not.toHaveBeenCalled();
  });

  it("rejects a runtime-invalid field value before emitting a log line", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const invalidFields = { route: { path: "/api/leads" } };

    expect(() => logInfo(context, "lead.created", invalidFields as never)).toThrow(
      /unsafe log field/i,
    );
    expect(info).not.toHaveBeenCalled();
  });
});
