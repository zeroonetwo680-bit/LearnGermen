type Props = {
  type: "radio" | "checkbox";
  checked: boolean;
  label: string;
  onChange: () => void;
  name: string;
};

export function QuestionOption({ type, checked, label, onChange, name }: Props) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 transition hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-700">
      <input type={type} checked={checked} onChange={onChange} name={name} className="mt-1" />
      <span>{label}</span>
    </label>
  );
}
