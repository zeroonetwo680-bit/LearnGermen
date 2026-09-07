import type { LessonDto } from "@/lib/api/contracts/lesson";
import { MarkdownContent } from "@/components/lessons/markdown-content";
import { GermanInlineText } from "@/components/lessons/german-inline-text";

export function LessonContent({ lesson }: { lesson: LessonDto }) {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <MarkdownContent content={lesson.content.introduction} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">محاور الشرح</h2>
          <div className="mt-5 space-y-5">
            {lesson.content.sections.map((section) => (
              <div key={section.title}>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">{section.title}</h3>
                <div className="mt-2 text-sm leading-8 text-slate-600 dark:text-slate-300">
                  <MarkdownContent content={section.body} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">أهداف التعلم</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {lesson.content.objectives.map((objective) => (
                <li key={objective} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                  {objective}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">أمثلة سريعة</h2>
            <div className="mt-4 space-y-4">
              {lesson.content.examples.map((example) => (
                <div key={example.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <GermanInlineText>{example.german}</GermanInlineText>
                  {example.transliterationAr ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{example.transliterationAr}</p> : null}
                  <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">{example.meaningAr}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {lesson.content.summary ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <MarkdownContent content={lesson.content.summary} />
        </section>
      ) : null}
    </div>
  );
}
