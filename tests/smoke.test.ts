import { describe, expect, it } from "vitest";

describe("test harness", () => {
  it("provides jsdom and jest-dom matchers", () => {
    const main = document.createElement("main");
    document.body.append(main);

    expect(main).toBeInTheDocument();

    main.remove();
  });
});
