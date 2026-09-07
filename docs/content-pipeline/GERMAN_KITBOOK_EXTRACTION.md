# German Kitbook Extraction Pipeline

## Source
- Input PDF: `files/germen-kitbook.pdf`
- Runtime app source: normalized JSON fixtures under `src/lib/api/mock/fixtures/`
- Raw extraction archive: `src/lib/api/mock/fixtures/raw/book-pages.json`

## How extraction works
1. `scripts/extract-kitbook.ts` reads the local PDF.
2. It uses `pdf-parse` to extract page-by-page text.
3. It normalizes whitespace and null characters.
4. It writes a traceable JSON document with:
   - `source`
   - `extractedAt`
   - `pageCount`
   - `pages[] { pageNumber, text }`

Run it with:

```bash
pnpm extract:kitbook
```

## Why there are both raw and normalized files
The PDF is useful as a source, but not suitable for direct rendering because it contains:
- irregular whitespace
- mixed Arabic and German ordering artifacts
- OCR-like punctuation noise
- dense tables that need curriculum-level grouping

For that reason, the pipeline is deliberately **two-step**:
- **raw extraction** for auditability
- **manual normalization and enrichment** for learning UX

## Mapping strategy used in this project
The first pages of the book clearly cover:
- alphabet
- compound sounds
- special pronunciation rules
- articles and grammatical gender
- pronouns and sentence order
- prepositions and plural examples
- cardinal and ordinal numbers
- fractions, multiples, measurements, and time
- common verbs and practical vocabulary
- short real-life phrases and mini dialogues

These were reorganized into 4 units and 12 lessons so the content can be browsed and learned interactively.

## Source page preservation
Every normalized lesson includes:
- `content.sourcePages`

The lesson UI surfaces this as a source note so learners know which book pages the lesson came from.

## Manual enrichment performed
The following elements were manually normalized or lightly enriched:
- cleaner Arabic lesson titles
- English slugs
- grouped vocabulary lists
- exercise blocks suitable for interactive UI
- quiz questions with explanations
- lesson summaries and objectives

The enrichment remains faithful to the original scope of the PDF and does not introduce unrelated curriculum areas.
