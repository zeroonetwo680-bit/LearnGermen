import {
  BookOpenCheck,
  BookText,
  Calculator,
  CircleHelp,
  FileText,
  GraduationCap,
  Languages,
  Layers3,
  MessageSquareText,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  BookOpenCheck,
  BookText,
  Calculator,
  CircleHelp,
  FileText,
  GraduationCap,
  Languages,
  Layers3,
  MessageSquareText,
  MessagesSquare,
};

export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? GraduationCap;
  return <Icon className={className} />;
}
