import { Expense } from "./types";
import { monthKey } from "./utils";

export function totalSpent(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amountCents, 0);
}

export function monthSpent(expenses: Expense[], ref: Date = new Date()): number {
  const y = ref.getFullYear();
  const m = ref.getMonth();
  return expenses
    .filter(e => {
      const d = new Date(e.date + "T00:00:00");
      return d.getFullYear() === y && d.getMonth() === m;
    })
    .reduce((sum, e) => sum + e.amountCents, 0);
}

export function byCategory(expenses: Expense[]): { category: string, amountCents: number }[] {
  const map = new Map<string, number>();
  for (const e of expenses) {
    map.set(e.category, (map.get(e.category) || 0) + e.amountCents);
  }
  return Array.from(map.entries()).map(([category, amountCents]) => ({ category, amountCents }));
}

export function topCategories(expenses: Expense[], n = 3) {
  return byCategory(expenses).sort((a,b)=> b.amountCents - a.amountCents).slice(0, n);
}

export function monthlyTotals(expenses: Expense[], monthsBack = 6, ref: Date = new Date()) {
  const map = new Map<string, number>();
  // seed months to include zero months
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    map.set(monthKey(d), 0);
  }
  for (const e of expenses) {
    const d = new Date(e.date + "T00:00:00");
    const key = monthKey(d);
    if (map.has(key)) {
      map.set(key, (map.get(key) || 0) + e.amountCents);
    }
  }
  return Array.from(map.entries()).map(([month, amountCents]) => ({ month, amountCents }));
}
