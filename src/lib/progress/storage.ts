import { z } from "zod";

export function readStorage<T>(key: string, schema: z.ZodType<T>, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return schema.parse(parsed);
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function readSessionStorage<T>(key: string, schema: z.ZodType<T>): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    return schema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeSessionStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(key, JSON.stringify(value));
}
