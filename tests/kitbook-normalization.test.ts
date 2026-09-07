import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { analyzeNormalizedPage, extractSectionsFromPages, normalizePdfText } from "../scripts/lib/kitbook-normalization";

describe("kitbook normalization", () => {
  test("normalizes whitespace and rejoins wrapped German tokens", () => {
    const input = "Drei und\nzwanzig\nFluggesellscha\nft\n  \n";
    expect(normalizePdfText(input)).toBe("Drei und zwanzig\nFluggesellschaft");
  });

  test("extracts top-level sections and nested sub-sections from normalized pages", () => {
    const pages = [
      analyzeNormalizedPage(
        1,
        [
          "روفﺣ ءﺎﺟﮭﻟا",
          "فﺮﺤﻟا ﻆﻔﻠﻟا تﺎﻈﺣﻼﻣ",
          "A a آ ... Apfel",
          "B b ... Baum",
          "تﺎظﺣﻼﻣ ﻲﻓ طقﻧﻟا",
          "• eu ... Deutsch",
          "• ei ... Frankreich",
        ].join("\n"),
      ),
      analyzeNormalizedPage(
        2,
        [
          "أدوات فﯾرﻌﺗﻟا",
          "Der Die Das",
          "أداة رﯾﻛﻧﺗﻟا",
          "Ein Kein",
        ].join("\n"),
      ),
    ];

    const result = extractSectionsFromPages(pages);
    expect(result.sectionCount).toBeGreaterThanOrEqual(4);
    expect(result.topLevelCount).toBeGreaterThanOrEqual(2);
    expect(result.subsectionCount).toBeGreaterThanOrEqual(1);
    expect(result.sections[0]).toMatchObject({ title: "روفﺣ ءﺎﺟﮭﻟا", depth: 1 });
    expect(result.sections.some((section) => section.title === "تﺎظﺣﻼﻣ ﻲﻓ طقﻧﻟا" && section.depth === 2)).toBe(true);
    expect(result.sections.some((section) => section.title === "أدوات فﯾرﻌﺗﻟا" && section.kind === "grammar")).toBe(true);
  });

  test("checked-in raw fixtures include page numbers and extracted sections", () => {
    const pagesFixture = JSON.parse(
      readFileSync(path.resolve(process.cwd(), "src/lib/api/mock/fixtures/raw/book-pages.json"), "utf8"),
    ) as {
      pageCount: number;
      pages: Array<{ pageNumber: number; lines: Array<{ kind: string }> }>;
    };
    const sectionsFixture = JSON.parse(
      readFileSync(path.resolve(process.cwd(), "src/lib/api/mock/fixtures/raw/book-sections.json"), "utf8"),
    ) as {
      sectionCount: number;
      topLevelCount: number;
      sections: Array<{ sourcePages: number[]; depth: number }>;
    };

    expect(pagesFixture.pageCount).toBeGreaterThan(100);
    expect(pagesFixture.pages[0]?.pageNumber).toBe(1);
    expect(pagesFixture.pages[0]?.lines.length).toBeGreaterThan(5);
    expect(sectionsFixture.sectionCount).toBeGreaterThan(40);
    expect(sectionsFixture.topLevelCount).toBeGreaterThan(20);
    expect(sectionsFixture.sections.every((section) => section.sourcePages.length > 0)).toBe(true);
    expect(sectionsFixture.sections.some((section) => section.depth === 2)).toBe(true);
  });
});
