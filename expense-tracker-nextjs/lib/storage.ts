import { Expense } from "./types";

const KEY = "pros-expenses-v1";

export function loadExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as Expense[];
    // Basic shape guard
    if (!Array.isArray(data)) return [];
    return data.map(e => ({
      ...e,
      amountCents: Number(e.amountCents) || 0,
      createdAt: Number(e.createdAt) || Date.now(),
      updatedAt: Number(e.updatedAt) || Date.now()
    }));
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(expenses));
  } catch {
    // fail silently
  }
}
