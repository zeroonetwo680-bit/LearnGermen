"use client";

import Link from "next/link";
import { BookOpenCheck, Languages, Library, Sparkles } from "lucide-react";
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
  { id: "explanation", label: "الشرح", icon: Library },
  { id: "vocabulary", label: "المفردات", icon: Languages },
  { id: "pronunciation", label: "قواعد النطق", icon: Sparkles },
  { id: "exercises", label: "التمارين", icon: BookOpenCheck },
  { id: "resources", label: "المصادر", icon: Library },
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

  const counts: Record<(typeof tabs)[number]["id"], number | null> = {
    explanation: null,
    vocabulary: vocabulary.length,
    pronunciation: lesson.content.pronunciationRules.length,
    exercises: exercises.length,
    resources: resources.length,
  };

  return (
    <div className="space-y-6">
      <div className="premium-card-strong rounded-[1.9rem] p-4">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950"
                    : "border border-slate-200 bg-white/75 text-slate-700 hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-sky-800 dark:hover:text-sky-400",
                )}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
                {counts[tab.id] !== null ? (
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    isActive ? "bg-white/15 text-white dark:bg-slate-200 dark:text-slate-900" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                  )}>
                    {counts[tab.id]}
                  </span>
                ) : null}
              </button>
            );
          })}
          <Link href={`/lessons/${lesson.slug}/quiz`} className="inline-flex items-center gap-3 rounded-[1.2rem] border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-950/50">
            ابدأ الاختبار
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs dark:bg-emerald-900/70">{lesson.questionCount}</span>
          </Link>
        </div>
      </div>

      {activeTab === "explanation" ? <LessonContent lesson={lesson} /> : null}
      {activeTab === "vocabulary" ? <VocabularyList items={vocabulary} /> : null}
      {activeTab === "pronunciation" ? <PronunciationRules rules={lesson.content.pronunciationRules} /> : null}
      {activeTab === "exercises" ? <ExerciseSection exercises={exercises} /> : null}
      {activeTab === "resources" ? <LessonResources resources={resources} /> : null}
    </div>
  );
}
