import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";

const pdfPath = path.resolve(process.cwd(), process.env.KITBOOK_PDF_PATH || "./files/germen-kitbook.pdf");
const outputPath = path.resolve(
  process.cwd(),
  "./src/lib/api/mock/fixtures/raw/book-pages.json",
);

function normalizeText(input: string) {
  return input
    .replace(/\r/g, "")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ ]+\n/g, "\n")
    .trim();
}

async function main() {
  const buffer = await readFile(pdfPath);
  const parser = new PDFParse({ data: buffer });
  const text = await parser.getText({ parsePageInfo: true });

  const pages = (text.pages ?? []).map((page, index) => ({
    pageNumber: index + 1,
    text: normalizeText(page.text ?? ""),
  }));

  const payload = {
    source: pdfPath,
    extractedAt: new Date().toISOString(),
    pageCount: pages.length,
    pages,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await parser.destroy();

  console.log(`Extracted ${pages.length} pages to ${path.relative(process.cwd(), outputPath)}`);
}

main().catch((error) => {
  console.error("Failed to extract kitbook:", error);
  process.exitCode = 1;
});
