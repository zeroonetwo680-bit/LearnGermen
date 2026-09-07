# German Learning Backend Blueprint

## Recommended phase-2 stack
- REST API
- PostgreSQL
- object storage for downloadable files
- server-side quiz grading
- session-based or token-based authentication

## Migration plan
1. Keep DTO contracts stable.
2. Re-implement mock endpoints on the real backend.
3. Switch `NEXT_PUBLIC_API_MODE=http`.
4. Replace the local progress repository with a remote implementation.
5. Persist quiz attempts and review data server-side.

## Backend responsibilities
- content CRUD for units, lessons, vocabulary, exercises, resources, and questions
- server-side grading and attempt storage
- student progress tracking
- admin publishing workflow
- analytics on lesson and quiz usage

## Authorization outline
- `student`: browse lessons, submit quizzes, manage personal progress
- `admin`: create/edit/publish content, manage resources and question banks

## Notes about current frontend assumptions
- browser requests are relative
- client components fetch through endpoint modules only
- UI expects Arabic-first content plus LTR German text snippets
