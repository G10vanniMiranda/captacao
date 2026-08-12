import {
  commercialPageSchema,
  type CommercialPage,
} from "@/features/acquisition/content.schema";

const parsedCommercialPages = commercialPageSchema.array().length(2).parse([
  {
    id: "site-profissional-v1",
    slug: "criacao-de-site-profissional",
    offerType: "SITE",
    intentId: "contratar-site-profissional",
    problem: "presenca-digital-sem-conversao",
    solution: "site-profissional-sob-medida",
    segment: null,
    title: "Criação de site profissional sob medida",
    description:
      "Planeje um site alinhado ao seu negócio e solicite um diagnóstico inicial.",
    headline:
      "Um site profissional para transformar interesse em oportunidades",
    proposition:
      "Diagnóstico orientado ao objetivo, funcionalidades, prazo e contexto atual do negócio.",
    cta: "Solicitar diagnóstico do site",
  },
  {
    id: "sistema-sob-medida-v1",
    slug: "desenvolvimento-de-sistema-sob-medida",
    offerType: "SYSTEM",
    intentId: "contratar-sistema-sob-medida",
    problem: "processo-operacional-limitante",
    solution: "sistema-sob-medida",
    segment: null,
    title: "Desenvolvimento de sistema sob medida",
    description:
      "Estruture o problema operacional e solicite um diagnóstico para um sistema sob medida.",
    headline:
      "Um sistema sob medida para resolver o processo que limita sua operação",
    proposition:
      "Diagnóstico baseado no processo atual, usuários, integrações, prazo e investimento.",
    cta: "Solicitar diagnóstico do sistema",
  },
]);

export const commercialPages: readonly Readonly<CommercialPage>[] = Object.freeze(
  parsedCommercialPages.map((page) => Object.freeze(page)),
);

export function getCommercialPage(
  slug: string,
): Readonly<CommercialPage> | undefined {
  return commercialPages.find((page) => page.slug === slug);
}
