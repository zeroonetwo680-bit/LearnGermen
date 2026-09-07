import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  type: "radio" | "checkbox";
  checked: boolean;
  label: string;
  onChange: () => void;
  name: string;
};

export function QuestionOption({ type, checked, label, onChange, name }: Props) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-[1.3rem] border p-4 text-sm leading-7 transition",
        checked
          ? "border-sky-400 bg-sky-50/80 shadow-sm dark:border-sky-700 dark:bg-sky-950/30"
          : "border-slate-200 bg-white/80 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-sky-800",
      )}
    >
      <input type={type} checked={checked} onChange={onChange} name={name} className="sr-only" />
      <span
        className={cn(
          "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border transition",
          checked
            ? "border-sky-500 bg-sky-500 text-white"
            : "border-slate-300 bg-white text-transparent dark:border-slate-600 dark:bg-slate-950",
        )}
      >
        <Check className="size-3.5" />
      </span>
      <span className="text-slate-700 dark:text-slate-100">{label}</span>
    </label>
  );
}
