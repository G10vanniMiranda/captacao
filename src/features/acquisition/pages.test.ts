import { describe, expect, it } from "vitest";

import { commercialPageSchema } from "@/features/acquisition/content.schema";
import {
  commercialPages,
  getCommercialPage,
} from "@/features/acquisition/pages";

describe("commercialPages", () => {
  it("contains exactly one distinct page for each approved offer", () => {
    expect(commercialPages).toHaveLength(2);
    expect(commercialPages.map((page) => page.offerType).sort()).toEqual([
      "SITE",
      "SYSTEM",
    ]);
    expect(new Set(commercialPages.map((page) => page.id)).size).toBe(2);
    expect(new Set(commercialPages.map((page) => page.slug)).size).toBe(2);
    expect(new Set(commercialPages.map((page) => page.intentId)).size).toBe(2);
  });

  it("resolves a stable page by slug without generating other combinations", () => {
    expect(getCommercialPage("criacao-de-site-profissional")?.id).toBe(
      "site-profissional-v1",
    );
    expect(
      getCommercialPage("desenvolvimento-de-sistema-sob-medida")?.id,
    ).toBe("sistema-sob-medida-v1");
    expect(getCommercialPage("site-generico-inexistente")).toBeUndefined();
  });

  it("rejects unstable identifiers at the content boundary", () => {
    expect(() =>
      commercialPageSchema.parse({
        ...commercialPages[0],
        id: "site-sem-versao",
      }),
    ).toThrow();
  });
});
