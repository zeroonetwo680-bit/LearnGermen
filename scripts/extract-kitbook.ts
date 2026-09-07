import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import { analyzeNormalizedPage, extractSectionsFromPages } from "./lib/kitbook-normalization";

const pdfPath = path.resolve(process.cwd(), process.env.KITBOOK_PDF_PATH || "./files/germen-kitbook.pdf");
const pagesOutputPath = path.resolve(process.cwd(), "./src/lib/api/mock/fixtures/raw/book-pages.json");
const sectionsOutputPath = path.resolve(process.cwd(), "./src/lib/api/mock/fixtures/raw/book-sections.json");

async function main() {
  const buffer = await readFile(pdfPath);
  const parser = new PDFParse({ data: buffer });
  const text = await parser.getText({ parsePageInfo: true });

  const pages = (text.pages ?? []).map((page, index) => analyzeNormalizedPage(index + 1, page.text ?? ""));
  const sections = extractSectionsFromPages(pages);

  const sharedMeta = {
    source: pdfPath,
    extractedAt: new Date().toISOString(),
    pageCount: pages.length,
  };

  await mkdir(path.dirname(pagesOutputPath), { recursive: true });
  await writeFile(
    pagesOutputPath,
    `${JSON.stringify(
      {
        ...sharedMeta,
        pages,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  await writeFile(
    sectionsOutputPath,
    `${JSON.stringify(
      {
        ...sharedMeta,
        ...sections,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  await parser.destroy();

  console.log(`Extracted ${pages.length} pages to ${path.relative(process.cwd(), pagesOutputPath)}`);
  console.log(`Extracted ${sections.sectionCount} structured sections to ${path.relative(process.cwd(), sectionsOutputPath)}`);
}

main().catch((error) => {
  console.error("Failed to extract kitbook:", error);
  process.exitCode = 1;
});
