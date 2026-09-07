import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatArabicNumber(value: number) {
  return new Intl.NumberFormat("ar-EG").format(value);
}

export function normalizeSearchValue(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function setEquals(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const aSet = new Set(a);
  return b.every((item) => aSet.has(item));
}
