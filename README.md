# LearnGermen

Arabic-first Next.js platform for learning German from the local kitbook PDF.

## Features
- PDF extraction to JSON
- mock-first typed API architecture
- Arabic RTL UI with LTR German snippets
- structured units and lessons
- vocabulary cards
- pronunciation rules
- interactive exercises
- quiz grading with answer review
- local progress dashboard

## Source book
- `files/germen-kitbook.pdf`
- extracted raw pages: `src/lib/api/mock/fixtures/raw/book-pages.json`

## Commands
```bash
pnpm install
pnpm extract:kitbook
pnpm dev
pnpm lint
pnpm test:mock
pnpm build
```
