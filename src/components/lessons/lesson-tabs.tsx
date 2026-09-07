"use client";

import Link from "next/link";
import { useState } from "react";
import type { ExerciseDto } from "@/lib/api/contracts/exercise";
import type { LessonDto, ResourceDto } from "@/lib/api/contracts/lesson";
import type { VocabularyItemDto } from "@/lib/api/contracts/vocabulary";
import { ExerciseSection } from "@/components/lessons/exercise-section";
import { LessonContent } from "@/components/lessons/lesson-content";
import { LessonResources } from "@/components/lessons/lesson-resources";
import { PronunciationRules } from "@/components/lessons/pronunciation-rules";
import { VocabularyList } from "@/components/lessons/vocabulary-list";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "explanation", label: "الشرح" },
  { id: "vocabulary", label: "المفردات" },
  { id: "pronunciation", label: "قواعد النطق" },
  { id: "exercises", label: "التمارين" },
  { id: "resources", label: "المصادر" },
] as const;

export function LessonTabs({
  lesson,
  vocabulary,
  exercises,
  resources,
}: {
  lesson: LessonDto;
  vocabulary: VocabularyItemDto[];
  exercises: ExerciseDto[];
  resources: ResourceDto[];
}) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("explanation");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              activeTab === tab.id
                ? "bg-sky-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
            )}
          >
            {tab.label}
          </button>
        ))}
        <Link href={`/lessons/${lesson.slug}/quiz`} className="rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-950/50">
          الاختبار
        </Link>
      </div>

      {activeTab === "explanation" ? <LessonContent lesson={lesson} /> : null}
      {activeTab === "vocabulary" ? <VocabularyList items={vocabulary} /> : null}
      {activeTab === "pronunciation" ? <PronunciationRules rules={lesson.content.pronunciationRules} /> : null}
      {activeTab === "exercises" ? <ExerciseSection exercises={exercises} /> : null}
      {activeTab === "resources" ? <LessonResources resources={resources} /> : null}
    </div>
  );
}
