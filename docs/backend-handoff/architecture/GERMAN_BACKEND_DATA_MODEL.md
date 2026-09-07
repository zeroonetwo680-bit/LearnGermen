# German Learning Backend Data Model

## Core entities

### Unit
- id
- slug
- order
- title
- description
- icon
- color

### Lesson
- id
- unit_id
- slug
- number
- title
- description
- level
- duration
- status
- updated_at
- source_pages[]

### LessonSection
- id
- lesson_id
- title
- body
- kind
- sort_order

### PronunciationRule
- id
- lesson_id
- pattern
- sound_ar
- explanation

### PronunciationExample
- id
- pronunciation_rule_id
- german
- transliteration_ar
- meaning_ar

### LanguageExample
- id
- lesson_id
- german
- transliteration_ar
- meaning_ar
- notes

### Resource
- id
- lesson_id
- title
- type
- file_name
- file_path
- size
- downloadable
- viewable

### VocabularyItem
- id
- lesson_id
- german
- transliteration_ar
- meaning_ar
- article
- plural
- part_of_speech
- notes
- tags[]

### Exercise
- id
- lesson_id
- order
- type
- title
- instructions
- prompt

### ExerciseItem
- id
- exercise_id
- prompt
- left_value
- right_value
- text
- options_json
- answer_json

### Question
- id
- lesson_id
- type
- question
- explanation
- points

### QuestionOption
- id
- question_id
- option_id
- text

### QuestionAnswerKey
- question_id
- option_id

### QuizAttempt
- id
- lesson_id
- student_id
- started_at
- completed_at
- score
- total
- percent

### QuizAttemptAnswer
- id
- attempt_id
- question_id
- selected_option_ids[]
- correct_option_ids[]
- is_correct
- explanation_snapshot

### Progress
- student_id
- completed_lessons[]
- quiz_scores_json
- last_visited_lesson_id
- updated_at
