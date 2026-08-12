import { afterEach, describe, expect, it, vi } from "vitest";

import { createRequestContext } from "@/lib/observability/request-context";

describe("createRequestContext", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("preserves a valid inbound request ID", () => {
    const request = new Request("https://example.test/leads", {
      headers: {
        "x-request-id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      },
    });

    const context = createRequestContext(request);

    expect(context.requestId).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
    expect(context.startedAt).toEqual(expect.any(Number));
  });

  it("replaces an unsafe inbound request ID and records its start time", () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "0f8fad5b-d9cb-469f-a165-70867728950e",
    );
    vi.spyOn(Date, "now").mockReturnValue(1_723_456_789_000);
    const request = new Request("https://example.test/leads", {
      headers: { "x-request-id": "not-a-uuid" },
    });

    const context = createRequestContext(request);

    expect(context).toEqual({
      requestId: "0f8fad5b-d9cb-469f-a165-70867728950e",
      startedAt: 1_723_456_789_000,
    });
  });
});
