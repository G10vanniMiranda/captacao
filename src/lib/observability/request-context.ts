export type RequestContext = Readonly<{
  requestId: string;
  startedAt: number;
}>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createRequestContext(request: Request): RequestContext {
  const inboundRequestId = request.headers.get("x-request-id");

  return {
    requestId:
      inboundRequestId && UUID_PATTERN.test(inboundRequestId)
        ? inboundRequestId
        : crypto.randomUUID(),
    startedAt: Date.now(),
  };
}
