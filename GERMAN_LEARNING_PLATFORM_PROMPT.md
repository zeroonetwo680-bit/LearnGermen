# FULL PROJECT PROMPT — منصة تعلم الألمانية | من كتاب تعلم الألمانية بالنطق المكتوب (Next.js + Mock-first API)

> **How to use this file**
> Copy everything below the horizontal rule into your AI coding assistant (Cursor / Windsurf / Claude Code / ChatGPT) as the complete project prompt.
>
> This prompt adapts the original architecture strategy into a new product:
> 1. A **mock-first Next.js architecture** with transport adapters, contracts + Zod validation, TanStack Query hooks, server/client API clients, fixture-backed mock transport, thin App Router pages, and Vitest workflow tests.
> 2. A **German-learning platform for Arabic speakers** built from the source PDF at `/files/germen-kitbook.pdf`.
>
> The platform must extract and normalize the book into structured JSON, then use that JSON interactively in the frontend for lessons, explanations, vocabulary, pronunciation, exercises, quizzes, answers, and review.
>
> **Important product direction for this version:**
> - Arabic-first interface (**RTL**)
> - German lesson content embedded throughout the app
> - Source data comes primarily from the PDF, but may be **cleaned, normalized, reorganized, and lightly enriched** to make the learning experience interactive and usable
> - Frontend-only v1, but architected exactly as if a real backend will be added next
>
> Do not start coding until you have read this entire document. Follow the phases in order. Every phase gate must pass before moving on.

---

# 1. Role & Mission

You are building **"تعلم الألمانية بالنطق المكتوب"** — a modern, Arabic-first educational website for learning **German** through Arabic explanations and written pronunciation.

The product is based on the local source PDF:

```txt
/files/germen-kitbook.pdf
```

The book contains foundational German-learning material such as:
- German alphabet and letter sounds
- compound sounds and pronunciation rules
- Arabic transliteration for German words
- articles and grammatical gender
- pronouns and sentence basics
- numbers and ordinals
- common verbs and usage
- time, measurement, and everyday vocabulary
- later vocabulary sections and practical expressions

The platform must feel like a real learning product, not a PDF viewer. It should provide:
- structured units and lessons
- Arabic explanations with embedded German examples
- pronunciation rules and examples
- vocabulary cards
- practice exercises with answer reveal and review
- quizzes with instant grading and explanations
- previous/next lesson navigation
- a local progress dashboard
- downloadable source resources

## Hard constraints for v1

- **Frontend-only**
- **No backend, no database, no auth, no external API**
- All runtime content comes from **local JSON fixtures**
- But the architecture must be built **exactly** as if a backend will be introduced tomorrow
- The UI must **never touch raw fixture JSON directly**
- The PDF must be **extracted and normalized into JSON** before the UI consumes it

The architecture you must reproduce is the **mock-first transport-adapter pattern**:

```txt
UI
 ↓  (@tanstack/react-query hooks / server functions)
Endpoint Factory  (typed operations, Zod-validated)
 ↓
Transport         (mock transport  ←→  fetch transport)
 ↓
Contract + Schema + Fixture (JSON)  →  future REST API
```

Switching from demo/local data to a real API must be **an environment-flag change only**:

```txt
NEXT_PUBLIC_API_MODE=mock  →  NEXT_PUBLIC_API_MODE=http
```

No UI component should be rewritten when that happens.

---

# 2. Technology Stack (exact)

| Category | Package | Notes |
|---|---|---|
| Framework | `next` **15+** (App Router) | Use latest stable; default TypeScript |
| Language | `typescript` ^5.x | `strict: true` |
| UI | `react` 19.x, `react-dom` 19.x | |
| Styles | `tailwindcss` ^4.x + `@tailwindcss/postcss` + `tw-animate-css` | CSS-first via `app/globals.css` |
| UI kit | shadcn/ui (`components.json`: style `new-york`, `rsc: true`, `tsx: true`, base color `neutral`, css variables `true`) + relevant Radix primitives | Install only what is used |
| Icons | `lucide-react` | |
| Data fetching | `@tanstack/react-query` ^5 + `@tanstack/react-query-devtools` | Required |
| Validation | `zod` ^3.24 | Request + response contracts |
| Forms | `react-hook-form` ^7 + `@hookform/resolvers` | Only where needed |
| Theme | `next-themes` | Dark/light/system |
| Toasts | `sonner` | |
| Markdown | `react-markdown` + `remark-gfm` | Lesson explanations |
| Debounce | `use-debounce` | Search |
| Misc helpers | `clsx`, `tailwind-merge`, `class-variance-authority`, `date-fns` | |
| PDF extraction | `pdf-parse` | For local extraction script |
| Script runner | `tsx` | Run extraction/normalization scripts |
| HTTP | native `fetch` | |
| Test | `vitest` ^4 + `@types/node` | Mock workflow suite |
| Package manager | `pnpm` | |

**Do NOT use:** Express, NestJS, MongoDB, PostgreSQL, Prisma, Firebase, Supabase, tRPC, any external backend, any CSS framework other than Tailwind.

## 2.1 Project setup (run first)

```bash
pnpm create next-app@latest learn-german-platform \
  --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
cd learn-german-platform
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card badge breadcrumb skeleton tabs accordion dialog sheet
pnpm dlx shadcn@latest add progress checkbox radio-group select input label form separator dropdown-menu
pnpm add @tanstack/react-query @tanstack/react-query-devtools zod next-themes sonner lucide-react
pnpm add react-markdown remark-gfm use-debounce date-fns pdf-parse
pnpm add -D vitest @types/node tsx
```

## 2.2 `package.json` scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "extract:kitbook": "tsx scripts/extract-kitbook.ts",
    "test:mock": "vitest run tests/mock-workflows.test.ts"
  }
}
```

## 2.3 `tsconfig.json` paths

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/lib/api/*": ["./src/lib/api/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/constants/*": ["./src/constants/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

## 2.4 PostCSS + Tailwind 4

`postcss.config.mjs`:

```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

`app/globals.css` starts with:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: var(--font-cairo), Tahoma, Arial, ui-sans-serif, system-ui, sans-serif;
  --font-latin: var(--font-inter), "Segoe UI", Arial, sans-serif;
}
```

## 2.5 `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

export default nextConfig;
```

---

# 3. Environment Configuration

```dotenv
NEXT_PUBLIC_API_MODE=mock
NEXT_PUBLIC_API_BASE_PATH=/api
API_INTERNAL_URL=http://localhost:5067
API_TIMEOUT_MS=15000
NEXT_PUBLIC_PROGRESS_MODE=local
KITBOOK_PDF_PATH=./files/germen-kitbook.pdf
```

`src/lib/api/config.ts`:

```ts
export type ApiMode = "mock" | "http";
export type ProgressMode = "local" | "api";

export const apiConfig = {
  mode: process.env.NEXT_PUBLIC_API_MODE === "http" ? ("http" as const) : ("mock" as const),
  browserBasePath: process.env.NEXT_PUBLIC_API_BASE_PATH || "/api",
  serverOrigin: process.env.API_INTERNAL_URL || "",
  timeoutMs: 15_000,
  progressMode: process.env.NEXT_PUBLIC_PROGRESS_MODE === "api" ? ("api" as const) : ("local" as const),
  kitbookPdfPath: process.env.KITBOOK_PDF_PATH || "./files/germen-kitbook.pdf",
} as const;
```

---

# 4. Complete File Structure (target)

```txt
learn-german-platform/
├── .env.example
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── pnpm-lock.yaml
├── tsconfig.json
│
├── files/
│   └── germen-kitbook.pdf
│
├── scripts/
│   └── extract-kitbook.ts
│
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   │
│   └── (public)/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── lessons/
│       │   ├── page.tsx
│       │   └── [slug]/
│       │       ├── page.tsx
│       │       ├── not-found.tsx
│       │       ├── loading.tsx
│       │       └── quiz/
│       │           ├── page.tsx
│       │           ├── loading.tsx
│       │           └── result/[attemptId]/page.tsx
│       ├── units/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       ├── dashboard/
│       │   ├── page.tsx
│       │   └── loading.tsx
│       └── about/
│           └── page.tsx
│
├── public/
│   └── resources/
│       ├── source-book/germen-kitbook.pdf
│       └── lesson-assets/...
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── site-header.tsx
│   │   │   ├── site-footer.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── site-breadcrumbs.tsx
│   │   ├── home/
│   │   │   ├── home-page.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── stats-section.tsx
│   │   │   ├── units-section.tsx
│   │   │   ├── featured-lessons-section.tsx
│   │   │   └── features-section.tsx
│   │   ├── lessons/
│   │   │   ├── lesson-card.tsx
│   │   │   ├── lesson-grid.tsx
│   │   │   ├── lesson-card-skeleton.tsx
│   │   │   ├── lesson-filter-bar.tsx
│   │   │   ├── lesson-search.tsx
│   │   │   ├── lesson-detail.tsx
│   │   │   ├── lesson-header.tsx
│   │   │   ├── lesson-tabs.tsx
│   │   │   ├── lesson-content.tsx
│   │   │   ├── markdown-content.tsx
│   │   │   ├── german-inline-text.tsx
│   │   │   ├── pronunciation-rules.tsx
│   │   │   ├── vocabulary-list.tsx
│   │   │   ├── vocabulary-flashcards.tsx
│   │   │   ├── exercise-section.tsx
│   │   │   ├── lesson-resources.tsx
│   │   │   └── lesson-navigation.tsx
│   │   ├── quiz/
│   │   │   ├── quiz-container.tsx
│   │   │   ├── question-card.tsx
│   │   │   ├── question-option.tsx
│   │   │   ├── quiz-progress.tsx
│   │   │   ├── quiz-navigation.tsx
│   │   │   ├── quiz-result.tsx
│   │   │   └── answer-review.tsx
│   │   ├── dashboard/
│   │   │   ├── dashboard-shell.tsx
│   │   │   ├── overall-progress.tsx
│   │   │   ├── completed-lessons-list.tsx
│   │   │   ├── recent-lessons-list.tsx
│   │   │   ├── best-scores.tsx
│   │   │   └── continue-learning.tsx
│   │   ├── shared/
│   │   │   ├── api-query-error.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── page-header.tsx
│   │   │   └── page-container.tsx
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── site-config.ts
│   │   ├── query-client.tsx
│   │   ├── quiz/
│   │   │   └── grade-quiz.ts
│   │   ├── progress/
│   │   │   ├── progress-repository.ts
│   │   │   ├── local-progress-repository.ts
│   │   │   └── storage.ts
│   │   └── api/
│   │       ├── config.ts
│   │       ├── contracts/
│   │       │   ├── common.ts
│   │       │   ├── home.ts
│   │       │   ├── unit.ts
│   │       │   ├── lesson.ts
│   │       │   ├── vocabulary.ts
│   │       │   ├── exercise.ts
│   │       │   ├── question.ts
│   │       │   └── progress.ts
│   │       ├── schemas/
│   │       │   ├── common.ts
│   │       │   └── course.ts
│   │       ├── transport/
│   │       │   ├── types.ts
│   │       │   ├── fetch-transport.ts
│   │       │   ├── query.ts
│   │       │   └── errors.ts
│   │       ├── client/
│   │       │   ├── api-client.ts
│   │       │   ├── browser-client.ts
│   │       │   ├── server-client.ts
│   │       │   └── scoped-client.ts
│   │       ├── mock/
│   │       │   ├── mock-transport.ts
│   │       │   ├── mock-store.ts
│   │       │   └── fixtures/
│   │       │       ├── raw/
│   │       │       │   └── book-pages.json
│   │       │       ├── home.json
│   │       │       ├── units.json
│   │       │       ├── lessons.json
│   │       │       ├── resources.json
│   │       │       ├── vocabulary.json
│   │       │       ├── exercises.json
│   │       │       └── questions.json
│   │       └── modules/
│   │           ├── home/
│   │           │   ├── endpoint.ts
│   │           │   ├── hooks.ts
│   │           │   ├── keys.ts
│   │           │   └── server.ts
│   │           ├── units/...
│   │           ├── lessons/...
│   │           ├── quiz/...
│   │           └── progress/
│   │               ├── keys.ts
│   │               └── hooks.ts
│   │
│   └── types/
│       └── index.ts
│
├── tests/
│   └── mock-workflows.test.ts
│
└── docs/
    ├── content-pipeline/
    │   └── GERMAN_KITBOOK_EXTRACTION.md
    └── backend-handoff/
        ├── README.md
        └── architecture/
            ├── GERMAN_BACKEND_DATA_MODEL.md
            ├── GERMAN_BACKEND_API_CONTRACT.md
            └── GERMAN_BACKEND_BLUEPRINT.md
```

---

# 5. Data Layer Architecture (critical)

## 5.1 Layering rule — never break this

```txt
Contract  →  Endpoint Factory  →  Transport  →  Hook / Server Function  →  UI
```

- **Contracts** define DTOs and filters only
- **Schemas** are Zod mirrors of the contracts
- **Endpoint factories** expose typed operations and return data directly
- **Transports** are either `mock-transport` or `fetch-transport`
- **Hooks** wrap endpoints in TanStack Query and are the only way client components fetch data
- **Server functions** are the only way server components fetch data
- **UI must never import fixture JSON, never import `mock-transport`, never call `fetch` directly**
- **UI must never parse the PDF directly**

## 5.2 Shared transport types

Use the same reference structure as the original architecture:

```ts
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";
export type ResponseSchema<TResponse> = ZodType<TResponse>;

export type RequestOptions<TBody = unknown, TResponse = unknown> = {
  method: HttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: TBody;
  requestSchema?: ZodType<TBody>;
  headers?: HeadersInit;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
  responseSchema?: ResponseSchema<TResponse>;
};

export interface ApiTransport {
  request<TResponse, TBody = unknown>(request: RequestOptions<TBody, TResponse>): Promise<TResponse>;
}
```

`ApiScope = "student"` for now.

## 5.3 API client behavior

Reproduce the original behavior exactly:
1. `validateRequest` using Zod → invalid input throws `ApiError { status: 422, code: "INVALID_API_REQUEST" }`
2. Send `X-Client-Surface: <scope>` header
3. `validateResponse` using Zod → invalid response throws `ApiError { status: 502, code: "INVALID_API_RESPONSE" }`
4. Unwrap `{ data }` envelopes; throw `ApiError` on non-2xx

## 5.4 `fetch-transport.ts`

Same behavior as the original strategy:
- Browser base path = relative `/api`
- Server origin = `API_INTERNAL_URL`
- `AbortController` timeout from `API_TIMEOUT_MS`
- `credentials: "include"`
- `Accept: application/json`
- RFC-7807-ish problem responses map to `ApiError`

## 5.5 Mode switch

```ts
const browserTransport = apiConfig.mode === "mock"
  ? createMockTransport()
  : createFetchTransport({ baseUrl: apiConfig.browserBasePath, timeoutMs: apiConfig.timeoutMs });
```

No component branches on mode.

## 5.6 Mock store + transport

- `mock-store.ts` seeds a `MockDatabase` from JSON fixtures
- Every fixture is parsed through Zod at seed time
- Store lives on `globalThis`
- Add latency (~120ms) so loading states are real
- `resetMockDatabase()` exists for tests
- The mock store must include the extracted curriculum, vocabulary, exercises, and quiz questions

## 5.7 Mock transport endpoint routing — full API contract

| Method | Path | Query/Filter | Returns | Notes |
|---|---|---|---|---|
| GET | `/v1/home/content` | – | `HomeContentDto` | hero, features, intro copy |
| GET | `/v1/units` | – | `UnitDto[]` | ordered by `order` |
| GET | `/v1/units/:idOrSlug` | – | `UnitDetailDto` | includes lesson summaries |
| GET | `/v1/lessons` | `search, unitId, level, skill, status, sort, page, pageSize` | `PageResult<LessonSummaryDto>` | search Arabic + German + tags |
| GET | `/v1/lessons/:slug` | – | `LessonDto` | full content + computed counts |
| GET | `/v1/lessons/:slug/resources` | – | `ResourceDto[]` | PDF/source/download assets |
| GET | `/v1/lessons/:slug/vocabulary` | – | `VocabularyItemDto[]` | cards + flashcards |
| GET | `/v1/lessons/:slug/exercises` | – | `ExerciseDto[]` | answerable practice blocks |
| GET | `/v1/lessons/:slug/questions` | – | `QuestionDto[]` with `correctAnswers` | review/mock only |
| GET | `/v1/lessons/:slug/quiz` | – | `QuizQuestionDto[]` without `correctAnswers` | runtime quiz payload |
| POST | `/v1/lessons/:slug/quiz/grade` | `GradeQuizInput` | `QuizResultDto` | mock grades locally |
| GET | `/v1/lessons/next/:slug` | – | `{ previous?, next? }` | auto navigation |

The list page must support search across:
- Arabic lesson titles
- Arabic explanations
- German vocabulary terms
- German examples
- tags

---

# 6. Domain Model (contracts)

## 6.1 Common (`contracts/common.ts`)

```ts
export type ApiScope = "student" | "admin";
export type PageMeta = { page: number; pageSize: number; total: number; totalPages: number };
export type PageResult<T> = { items: T[]; meta: PageMeta };
export type ApiProblem = { status: number; code: string; title: string; detail?: string; fields?: Record<string, string[]>; requestId?: string };
export type ListFilter = { page?: number; pageSize?: number; search?: string };
```

## 6.2 Unit (`contracts/unit.ts`)

```ts
export interface UnitDto {
  id: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  icon: string;
  color: "blue" | "green" | "violet" | "amber" | "rose";
  lessonCount: number;
  questionCount: number;
  vocabularyCount: number;
  exerciseCount: number;
}

export interface UnitDetailDto extends UnitDto {
  lessons: LessonSummaryDto[];
}
```

## 6.3 Lesson (`contracts/lesson.ts`)

```ts
export type LessonLevel = "A1" | "A2" | "B1";
export type LessonStatus = "published" | "draft";
export type LessonSort = "default" | "newest" | "duration" | "level";
export type LessonSkill = "alphabet" | "pronunciation" | "grammar" | "vocabulary" | "numbers" | "conversation";
export type ResourceType = "pdf" | "worksheet" | "image" | "reference" | "audio";

export interface LessonSummaryDto {
  id: string;
  slug: string;
  number: number;
  title: string;
  description: string;
  unitId: string;
  unitTitle: string;
  level: LessonLevel;
  duration: number;
  status: LessonStatus;
  tags: string[];
  skillFocus: LessonSkill[];
  questionCount: number;
  exerciseCount: number;
  vocabularyCount: number;
  updatedAt: string;
}

export interface PronunciationExampleDto {
  german: string;
  transliterationAr: string;
  meaningAr?: string;
}

export interface PronunciationRuleDto {
  id: string;
  pattern: string;
  soundAr: string;
  explanation: string;
  examples: PronunciationExampleDto[];
}

export interface LanguageExampleDto {
  id: string;
  german: string;
  transliterationAr?: string;
  meaningAr: string;
  notes?: string;
}

export interface LessonContentDto {
  introduction: string;
  objectives: string[];
  sections: {
    title: string;
    body: string;
    kind: "overview" | "grammar" | "pronunciation" | "usage";
  }[];
  pronunciationRules: PronunciationRuleDto[];
  examples: LanguageExampleDto[];
  summary?: string;
  sourcePages: number[];
}

export interface LessonDto extends LessonSummaryDto {
  unitSlug: string;
  content: LessonContentDto;
}

export interface LessonFilter extends ListFilter {
  unitId?: string;
  level?: LessonLevel;
  skill?: LessonSkill;
  status?: LessonStatus;
  sort?: LessonSort;
}

export interface ResourceDto {
  id: string;
  lessonId: string;
  title: string;
  type: ResourceType;
  fileName: string;
  filePath: string;
  size: string;
  description: string;
  downloadable: boolean;
  viewable: boolean;
}
```

## 6.4 Vocabulary (`contracts/vocabulary.ts`)

```ts
export type PartOfSpeech = "noun" | "verb" | "adjective" | "adverb" | "phrase" | "pronoun" | "number" | "other";

export interface VocabularyItemDto {
  id: string;
  lessonId: string;
  german: string;
  transliterationAr: string;
  meaningAr: string;
  article?: "der" | "die" | "das";
  plural?: string;
  partOfSpeech: PartOfSpeech;
  notes?: string;
  exampleGerman?: string;
  exampleTransliterationAr?: string;
  exampleMeaningAr?: string;
  tags: string[];
}
```

## 6.5 Exercises (`contracts/exercise.ts`)

```ts
export type ExerciseType = "fill-blank" | "matching" | "ordering" | "translation";

export interface ExerciseItemDto {
  id: string;
  prompt?: string;
  left?: string;
  right?: string;
  text?: string;
  options?: string[];
  answer?: string | string[];
}

export interface ExerciseDto {
  id: string;
  lessonId: string;
  order: number;
  type: ExerciseType;
  title: string;
  instructions: string;
  prompt: string;
  items: ExerciseItemDto[];
  explanation?: string;
}
```

## 6.6 Questions (`contracts/question.ts`)

```ts
export type QuestionType = "single-choice" | "multiple-choice" | "true-false";

export interface QuestionOptionDto { id: string; text: string }

export interface QuestionDto {
  id: string;
  lessonId: string;
  type: QuestionType;
  question: string;
  options: QuestionOptionDto[];
  correctAnswers: string[];
  explanation?: string;
  points: number;
}

export type QuizQuestionDto = Omit<QuestionDto, "correctAnswers">;

export interface GradeQuizInput {
  lessonId: string;
  answers: Record<string, string[]>;
  startedAt: string;
}

export interface GradedAnswerDto {
  questionId: string;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizResultDto {
  attemptId: string;
  lessonId: string;
  score: number;
  total: number;
  percent: number;
  correctCount: number;
  incorrectCount: number;
  answers: GradedAnswerDto[];
  completedAt: string;
}
```

## 6.7 Progress (`contracts/progress.ts`)

```ts
export interface LessonScoreDto {
  bestScore: number;
  attempts: number;
  lastScore: number;
  lastAttemptAt: string;
}

export interface ProgressDto {
  version: 1;
  completedLessons: string[];
  quizScores: Record<string, LessonScoreDto>;
  lastVisitedLessonId?: string;
  updatedAt: string;
}
```

Zod schemas in `schemas/course.ts` must mirror every DTO 1:1.

---

# 7. TanStack Query Conventions

Use the same pattern as the original architecture.

## 7.1 Provider

Keep the same default QueryClient strategy:
- `staleTime: 60s`
- `gcTime: 5m`
- `retry: 3`
- exponential retry delay
- `refetchOnWindowFocus: false`
- `throwOnError: false`

## 7.2 Keys convention

Extend lesson keys for vocabulary and exercises:

```ts
export const lessonKeys = {
  all: ["lessons"] as const,
  lists: () => [...lessonKeys.all, "list"] as const,
  list: (filter: LessonFilter = {}) => [...lessonKeys.lists(), normalizedFilter(filter)] as const,
  detail: (slug: string) => [...lessonKeys.all, "detail", slug] as const,
  resources: (slug: string) => [...lessonKeys.detail(slug), "resources"] as const,
  vocabulary: (slug: string) => [...lessonKeys.detail(slug), "vocabulary"] as const,
  exercises: (slug: string) => [...lessonKeys.detail(slug), "exercises"] as const,
  questions: (slug: string) => [...lessonKeys.detail(slug), "questions"] as const,
  quiz: (slug: string) => [...lessonKeys.detail(slug), "quiz"] as const,
  nav: (slug: string) => [...lessonKeys.all, "navigation", slug] as const,
};
```

## 7.3 Hooks shape

Provide hooks like:

```ts
export function useLessons(filter: LessonFilter = {})
export function useLesson(slug: string)
export function useLessonResources(slug: string)
export function useLessonVocabulary(slug: string)
export function useLessonExercises(slug: string)
export function useLessonQuiz(slug: string)
export function useGradeQuiz(slug: string)
```

Progress hooks still go through the repository abstraction.

## 7.4 Server vs client rule

- Server components call `server.ts` helpers
- Client components call hooks
- Never expose `API_INTERNAL_URL` through public env vars

---

# 8. Progress System (localStorage, backend-swappable)

`src/lib/progress/progress-repository.ts`:

```ts
export interface ProgressRepository {
  get(): Promise<ProgressDto>;
  markLessonCompleted(lessonId: string): Promise<ProgressDto>;
  saveQuizResult(lessonId: string, result: QuizResultDto): Promise<ProgressDto>;
  setLastVisitedLesson(lessonId: string): Promise<ProgressDto>;
  reset(): Promise<ProgressDto>;
}
```

- storage key: `learngerman-progress-v1`
- safe parse with Zod
- corrupted localStorage must reset safely
- completing a quiz marks a lesson completed
- dashboard derives progress from this repository

---

# 9. PDF Extraction + Content Normalization Spec

This section is mandatory and replaces the old manually-authored demo-content assumption.

## 9.1 Source-of-truth rule

The main content source is:

```txt
/files/germen-kitbook.pdf
```

The app must not consume the PDF directly at runtime. Instead:
1. Extract the PDF into raw structured text
2. Save raw extraction output to JSON for auditability
3. Normalize that content into clean domain fixtures
4. Validate all normalized fixtures with Zod
5. Render only through the API layer

## 9.2 Extraction script

Create:

```txt
scripts/extract-kitbook.ts
```

Responsibilities:
- Read the local PDF
- Extract page-by-page text
- Save raw output to:
  - `src/lib/api/mock/fixtures/raw/book-pages.json`
- Normalize obvious whitespace and OCR artifacts
- Preserve page numbers for traceability
- Output human-reviewable content, not a black box

The normalized lesson/vocabulary/exercise/question fixtures do **not** need to be generated fully automatically if cleanup is required. A mixed pipeline is acceptable:
- **PDF first**
- then **manual normalization / enrichment**
- then validated JSON fixtures

## 9.3 Content normalization rules

The PDF text may contain:
- spacing artifacts
- mixed Arabic/German punctuation
- OCR-like inconsistencies
- transliteration formatting issues
- repeated headers or page noise

You must clean these while preserving meaning.

Normalization must preserve or derive:
- Arabic title
- English slug
- source pages
- German content
- Arabic transliteration
- Arabic meaning/explanation
- vocabulary grouping
- quiz questions and explanations
- exercise prompts and answers

## 9.4 Required v1 curriculum size

Use the PDF content to produce **at least**:
- **4 units**
- **12 published lessons**
- **15–30 vocabulary items per lesson** where appropriate
- **3–6 exercises per lesson**
- **5–8 quiz questions per lesson**

Do not invent units that are unrelated to the book. If you need to enrich content, only do so in a way that remains faithful to the book’s scope.

## 9.5 Suggested unit map derived from the PDF

Use this as the default curriculum structure unless the extracted book structure clearly suggests a better grouping.

### Unit 1 — الحروف والنطق
1. `alphabet-and-letter-sounds` — حروف الهجاء والأصوات الأساسية
2. `compound-sounds-and-umlauts` — الحروف المركبة والأوملاوت
3. `special-pronunciation-rules` — قواعد النطق الخاصة مثل `ch`, `sch`, `sp`, `st`, `ß`

### Unit 2 — أساسيات القواعد
4. `articles-and-genders` — أدوات التعريف والتنكير والجنس
5. `pronouns-and-basic-sentence-order` — الضمائر وترتيب الجملة الأساسي
6. `prepositions-and-plurals` — حروف الجر والمفرد والجمع

### Unit 3 — الأعداد والوقت والمقاييس
7. `cardinal-numbers` — الأعداد الأصلية
8. `ordinals-fractions-and-multiples` — الأعداد الترتيبية والكسور والأضعاف
9. `time-dates-and-measurements` — الوقت والتواريخ والأوزان والمقاييس

### Unit 4 — المفردات والاستعمال اليومي
10. `common-verbs` — الأفعال كثيرة الاستعمال
11. `classroom-and-calculation-language` — لغة الصف والعمليات الحسابية والمفردات العملية
12. `everyday-vocabulary-and-mini-dialogues` — مفردات يومية وتعبيرات ومحادثات قصيرة

If the later pages of the book reveal strong sections such as family, shops, food, places, or occupations, you may extend the curriculum beyond 12 lessons while keeping the first 12 stable.

## 9.6 Fixtures to create

Create these JSON files:
- `home.json`
- `units.json`
- `lessons.json`
- `resources.json`
- `vocabulary.json`
- `exercises.json`
- `questions.json`
- `raw/book-pages.json`

All normalized records should include enough metadata for stable rendering.

## 9.7 Sample lesson entry

```json
{
  "id": "lesson-01",
  "slug": "alphabet-and-letter-sounds",
  "number": 1,
  "title": "حروف الهجاء والأصوات الأساسية",
  "description": "تعرّف على الحروف الألمانية وطريقة نطقها مع أمثلة عربية وألمانية من الكتاب.",
  "unitId": "unit-pronunciation",
  "level": "A1",
  "duration": 40,
  "status": "published",
  "tags": ["ألمانية", "نطق", "حروف"],
  "skillFocus": ["alphabet", "pronunciation"],
  "updatedAt": "2026-09-07",
  "content": {
    "introduction": "## مقدمة\nهذا الدرس يعرّفك على حروف الهجاء الألمانية وكيفية لفظها.",
    "objectives": [
      "تمييز الحروف الألمانية الأساسية",
      "ربط الحرف بطريقة النطق العربية التقريبية",
      "قراءة كلمات بسيطة من الكتاب"
    ],
    "sections": [
      {
        "title": "الحروف الأساسية",
        "body": "يتكون هذا الدرس من الحروف من A إلى Z مع أمثلة مثل Apfel و Baum و Dach.",
        "kind": "overview"
      }
    ],
    "pronunciationRules": [
      {
        "id": "pr-01",
        "pattern": "A a",
        "soundAr": "آ / أ",
        "explanation": "قد يلفظ ممدوداً أو قصيراً حسب موقعه في الكلمة.",
        "examples": [
          { "german": "Apfel", "transliterationAr": "أبفل", "meaningAr": "تفاحة" }
        ]
      }
    ],
    "examples": [
      {
        "id": "ex-01",
        "german": "Baum",
        "transliterationAr": "باوم",
        "meaningAr": "شجرة"
      }
    ],
    "summary": "## الخلاصة\nابدأ بحفظ شكل الحرف وصوته ومثال واحد عليه.",
    "sourcePages": [1, 2]
  }
}
```

## 9.8 Sample vocabulary item

```json
{
  "id": "v-01-1",
  "lessonId": "lesson-01",
  "german": "Apfel",
  "transliterationAr": "أبفل",
  "meaningAr": "تفاحة",
  "partOfSpeech": "noun",
  "tags": ["alphabet", "example"]
}
```

## 9.9 Sample exercise

```json
{
  "id": "e-01-1",
  "lessonId": "lesson-01",
  "order": 1,
  "type": "matching",
  "title": "طابق الحرف مع المثال",
  "instructions": "صل كل حرف بالمثال الصحيح من الكلمات الألمانية.",
  "prompt": "اختر المطابقة الصحيحة.",
  "items": [
    { "id": "1", "left": "A", "right": "Apfel" },
    { "id": "2", "left": "B", "right": "Baum" }
  ],
  "explanation": "يساعد هذا التمرين على ربط الحرف بمفردة مألوفة."
}
```

## 9.10 Sample question

```json
{
  "id": "q-04-1",
  "lessonId": "lesson-04",
  "type": "single-choice",
  "question": "ما أداة التعريف للمذكر في اللغة الألمانية؟",
  "options": [
    { "id": "a", "text": "Der" },
    { "id": "b", "text": "Die" },
    { "id": "c", "text": "Das" },
    { "id": "d", "text": "Ein" }
  ],
  "correctAnswers": ["a"],
  "explanation": "Der هي أداة التعريف للاسم المذكر في حالة الرفع.",
  "points": 1
}
```

## 9.11 `home.json`

Hero copy should reflect the new product, for example:
- title: **"تعلم الألمانية بطريقة أسهل"**
- subtitle: Arabic-first learning from the book with written pronunciation, vocabulary, exercises, and quizzes
- CTAs: `ابدأ التعلم` / `استعرض الدروس`
- features such as: `شرح عربي واضح`, `نطق مكتوب`, `مفردات منظمة`, `تمارين تفاعلية`, `اختبارات سريعة`, `مراجعة الإجابات`

Home stats must be computed dynamically from fixtures:
- number of lessons
- number of vocabulary items
- number of exercises
- number of units

---

# 10. Pages Specification

All pages live under `app/(public)/`. Pages are thin; interactivity lives in client components using hooks.

## 10.1 Root layout (`app/layout.tsx`)

```tsx
<html lang="ar" dir="rtl" suppressHydrationWarning className="h-full antialiased">
  <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </ThemeProvider>
    </QueryProvider>
  </body>
</html>
```

Metadata should be Arabic-first and use `locale: "ar_EG"`.

## 10.2 Home `/`

Sections:
1. `HeroSection`
2. `StatsSection` — عدد الدروس، عدد المفردات، عدد التمارين، عدد الوحدات
3. `UnitsSection`
4. `FeaturedLessonsSection`
5. `FeaturesSection`

## 10.3 Lessons `/lessons`

- Client page with `useLessons(filter)`
- Debounced search over Arabic + German fields
- Filters:
  - unit
  - level (`A1`, `A2`, `B1`)
  - skill focus
  - status
  - sort
- `keepPreviousData`
- Empty state and loading skeletons are mandatory

Lesson cards show:
- lesson number
- level badge
- title
- description
- duration
- vocabulary count
- exercise count
- question count
- `عرض الدرس`

## 10.4 Lesson detail `/lessons/[slug]`

Server component:
- `getLessonForServer(slug)`
- `getLessonResourcesForServer(slug)`
- `getLessonVocabularyForServer(slug)`
- `getLessonExercisesForServer(slug)`
- `notFound()` if missing

Use `generateStaticParams()` and `generateMetadata()`.

The lesson detail UI should render:
- breadcrumbs
- lesson header
- content tabs:
  - `الشرح`
  - `المفردات`
  - `قواعد النطق`
  - `التمارين`
  - `الاختبار`
  - `المصادر`
- previous/next lesson navigation
- source page reference note such as `المصدر: الصفحات 1–2 من الكتاب`

### Vocabulary tab
- card list and/or table
- German term with `lang="de" dir="ltr"`
- Arabic transliteration
- Arabic meaning
- article badge when available (`der`, `die`, `das`)
- plural when available
- optional flashcard mode

### Pronunciation tab
- pronunciation rule cards/tables
- pattern, Arabic approximation, explanation, examples

### Exercises tab
Interactive practice blocks, such as:
- fill in the blank
- match item to item
- reorder words
- translation self-check

Exercises are not the same as graded quiz questions. They may reveal answers locally after user interaction.

## 10.5 Quiz `/lessons/[slug]/quiz`

Server page fetches **sanitized** questions from `/quiz`.

Requirements:
- one question at a time
- support `single-choice`, `multiple-choice`, `true-false`
- progress bar
- previous/next buttons
- submit button
- **never show correct answers before submit**
- result screen with score, percent, correct/incorrect counts
- full answer review with explanations
- save result to progress repository

## 10.6 Units `/units` + `/units/[slug]`

Units grid with:
- icon
- title
- description
- lesson count
- vocabulary count
- exercise count

Unit detail shows its lessons.

## 10.7 Dashboard `/dashboard`

Client page from `useProgress()` + lessons data:
- overall progress
- completed lessons
- recent lessons
- best quiz scores
- continue learning

Empty state when user has no progress yet.

## 10.8 About `/about`

Static Arabic page describing:
- platform mission
- PDF-to-app idea
- unit overview
- how to study effectively with lessons + vocabulary + exercises + quiz

---

# 11. Quiz Engine (`src/lib/quiz/grade-quiz.ts`)

Pure function, no React, no I/O:

```ts
export function gradeQuiz(questions: QuestionDto[], answers: Record<string, string[]>): QuizResultDto
```

Rules:
- `single-choice` / `true-false`: exactly one selected answer equals the single correct answer
- `multiple-choice`: set equality only
- unanswered = incorrect
- score = sum of correct `points`
- total = sum of all points
- percent = rounded percentage
- preserve question order in result
- include explanation in answer review

This function is called only by the mock transport and tests.

---

# 12. Content Rendering Rules

This replaces the old code-focused markdown rendering section.

## 12.1 Markdown explanations

`MarkdownContent` should render lesson explanations safely using `react-markdown`.

Use it for:
- introduction
- section bodies
- summary
- about page long-form content

## 12.2 German text inside RTL UI

Because the app is Arabic-first but the learning content is German:
- overall layout is `dir="rtl"`
- German words, phrases, file paths, slugs, and inline examples must use `dir="ltr"`
- German content should also have `lang="de"`
- Arabic transliteration and explanation remain RTL

Create a small helper component such as `GermanInlineText` for consistent rendering.

## 12.3 Pronunciation presentation

Pronunciation rules should be displayed in structured cards/tables containing:
- German pattern
- Arabic sound approximation
- explanation
- one or more examples

## 12.4 Exercises UX

Prefer accessible, keyboard-friendly interactions:
- inputs for fill-in-the-blank
- select/button-based matching rather than drag-only interfaces
- step buttons for ordering if needed
- explicit `عرض الإجابة` / `إخفاء الإجابة` controls

---

# 13. Design System

- shadcn/ui with `new-york`, `neutral`, CSS variables
- Fonts:
  - **Cairo** for Arabic UI
  - **Inter** for German/Latin text
- Calm educational palette, not flashy
- Cards, badges, tabs, progress bars, accordions, breadcrumbs, dialogs, skeletons
- Native RTL layout
- German snippets remain LTR inside RTL containers
- Dark mode via `next-themes`

Avoid:
- overly decorative gradients
- giant hero-only landing page behavior
- clickable divs
- inaccessible drag-and-drop-only interactions

---

# 14. SEO, Accessibility, Performance, Errors

## SEO
- `generateMetadata()` on lesson/unit detail pages
- title template in Arabic
- canonical URLs
- Open Graph + Twitter metadata
- `locale: "ar_EG"`
- semantic `h1`

## Accessibility
- keyboard navigable
- visible focus states
- `aria-live` for quiz progress/results
- `aria-label` for icon-only controls
- do not rely on color alone in quiz correctness states
- mark German content with `lang="de"`

## Performance
- Server Components by default
- `use client` only where needed
- React Query caching
- static generation for lesson/unit pages
- debounced search
- loading skeletons

## Errors/Loading/Empty states
- global `loading.tsx`, `error.tsx`, `not-found.tsx`
- lesson-specific `not-found.tsx`
- shared `ApiQueryError`
- empty states for:
  - no lessons
  - no search results
  - no resources
  - no exercises
  - no quiz questions
  - no progress

---

# 15. Testing Strategy (Vitest)

`tests/mock-workflows.test.ts` must drive the same endpoint factories through a mock client.

Required scenarios:
1. Home content loads; title is Arabic; stats derive from fixtures
2. Units load; counts are computed; order is stable
3. Lessons list supports pagination, Arabic search, and German search
4. Lesson detail by slug works; unknown slug throws `ApiError 404 NOT_FOUND`
5. Vocabulary endpoint returns German text + Arabic transliteration + meaning
6. Exercises endpoint returns 3–6 interactive exercises per lesson
7. Quiz endpoint does **not** expose `correctAnswers`
8. Grade endpoint correctly handles single-choice, multiple-choice, and true-false
9. Malformed grade input throws `INVALID_API_REQUEST` 422
10. Progress repository persists safely and resets corrupt localStorage
11. Previous/next lesson navigation works across unit boundaries
12. All fixtures parse through Zod with no contract mismatches

---

# 16. Documentation (write, don’t stub)

Create:

## `docs/content-pipeline/GERMAN_KITBOOK_EXTRACTION.md`
Explain:
- how the PDF was extracted
- how raw pages map to units/lessons
- normalization rules
- how source pages are preserved
- what was manually enriched and why

## `docs/backend-handoff/README.md`
Explain mock-first architecture and how HTTP mode activates.

## `docs/backend-handoff/architecture/GERMAN_BACKEND_DATA_MODEL.md`
Data model derived from contracts:
- Unit
- Lesson
- PronunciationRule
- VocabularyItem
- Exercise
- Question
- QuizAttempt
- Progress

## `docs/backend-handoff/architecture/GERMAN_BACKEND_API_CONTRACT.md`
Freeze the endpoint contract from section 5.7.

## `docs/backend-handoff/architecture/GERMAN_BACKEND_BLUEPRINT.md`
Describe how to migrate from fixture JSON + localStorage to a real backend.

---

# 17. Build Phases (follow in order)

## Phase 1 — Scaffold + layout + theme + providers
Gate: app boots, RTL shell works, dark mode works, lint clean.

## Phase 2 — PDF extraction pipeline
Build `scripts/extract-kitbook.ts`, generate raw page JSON, document extraction, confirm source pages can be traced.
Gate: raw extraction file exists and is human-reviewable.

## Phase 3 — Data layer
Contracts, Zod schemas, normalized fixtures, mock store, mock transport, API clients, endpoint factories, hooks, server functions.
Gate: endpoint workflows pass for home/units/lessons/vocabulary/resources.

## Phase 4 — Home + Units + Lessons list
Gate: browsing and filtering work on responsive layouts.

## Phase 5 — Lesson detail + vocabulary + pronunciation + exercises
Gate: every lesson renders with tabs and interactive practice.

## Phase 6 — Quiz engine + result review
Gate: sanitized quiz payload, grading, answer review, no pre-submit answer leaks.

## Phase 7 — Dashboard + progress
Gate: quiz completion updates dashboard after refresh.

## Phase 8 — SEO + accessibility + bilingual polish
Gate: Arabic RTL is solid and German inline content behaves correctly.

## Phase 9 — Perf + hardening
Gate: no fixture-direct imports in UI, no silent failures, clean loading/error states.

## Phase 10 — Final
Gate:
- `pnpm build` clean
- `pnpm lint` clean
- `pnpm test:mock` green
- docs written

---

# 18. Definition of Done — Acceptance Checklist

1. [ ] `pnpm build` succeeds
2. [ ] `pnpm lint` has zero errors
3. [ ] `pnpm test:mock` passes
4. [ ] Source PDF is extracted into structured raw JSON
5. [ ] Normalized fixtures exist for units, lessons, vocabulary, exercises, questions, resources, and home content
6. [ ] UI never reads fixtures or the PDF directly
7. [ ] All routes work: `/`, `/lessons`, `/lessons/[slug]`, `/lessons/[slug]/quiz`, `/units`, `/units/[slug]`, `/dashboard`, `/about`
8. [ ] Search works in Arabic and German
9. [ ] Lesson detail includes explanations, vocabulary, pronunciation, exercises, and resources
10. [ ] Quiz works for all 3 question types
11. [ ] Correct answers are never shown before submit
12. [ ] Answer review shows selected answer, correct answer, and explanation
13. [ ] Progress survives refresh via localStorage
14. [ ] Previous/next lesson navigation works
15. [ ] RTL layout is correct and German inline content renders LTR where needed
16. [ ] Dark/light mode is readable across lessons, tabs, cards, exercises, and quizzes
17. [ ] `NEXT_PUBLIC_API_MODE=http` can switch to fetch transport without UI rewrites
18. [ ] Extraction and backend-handoff docs exist and match the contracts

---

# 19. Strategy Provenance

This prompt preserves the core architecture of the original strategy:
- `src/lib/api/{config,contracts,schemas,transport,client,mock,modules}`
- mock-first transport adapter
- Zod-validated fixtures at the boundary
- endpoint factories + query hooks + server helpers
- thin App Router pages
- environment-based transport switching
- contract-driven backend handoff

The main product changes are:
- domain shifted from programming education to German-language learning
- Arabic-first RTL interface
- content pipeline begins with **PDF extraction and normalization**
- lessons include vocabulary, pronunciation rules, exercises, and quizzes
- bilingual rendering rules are first-class
