# German Learning API Contract

## Endpoints

| Method | Path | Returns | Notes |
|---|---|---|---|
| GET | `/v1/home/content` | `HomeContentDto` | Hero + benefits + features |
| GET | `/v1/units` | `UnitDto[]` | Ordered by `order` |
| GET | `/v1/units/:idOrSlug` | `UnitDetailDto` | Includes lesson summaries |
| GET | `/v1/lessons` | `PageResult<LessonSummaryDto>` | Filters: `search`, `unitId`, `level`, `skill`, `status`, `sort`, `page`, `pageSize` |
| GET | `/v1/lessons/:slug` | `LessonDto` | Full lesson content |
| GET | `/v1/lessons/:slug/resources` | `ResourceDto[]` | Download/view links |
| GET | `/v1/lessons/:slug/vocabulary` | `VocabularyItemDto[]` | Vocabulary cards |
| GET | `/v1/lessons/:slug/exercises` | `ExerciseDto[]` | Interactive practice blocks |
| GET | `/v1/lessons/:slug/questions` | `QuestionDto[]` | Includes correct answers for review/tests only |
| GET | `/v1/lessons/:slug/quiz` | `QuizQuestionDto[]` | Sanitized questions without answer keys |
| POST | `/v1/lessons/:slug/quiz/grade` | `QuizResultDto` | Body = `GradeQuizInput` |
| GET | `/v1/lessons/next/:slug` | `{ previous?, next? }` | Lesson navigation |

## Validation rules
- request bodies are validated before transport dispatch
- response payloads are validated against Zod schemas
- invalid requests throw `INVALID_API_REQUEST` with 422
- invalid responses throw `INVALID_API_RESPONSE` with 502
