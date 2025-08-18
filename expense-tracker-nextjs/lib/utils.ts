import { Expense } from "./types";

export const CATEGORIES = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'] as const;

export function fmtCurrency(cents: number, currency = "USD") {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(cents / 100);
}

export function parseAmountToCents(input: string): number {
  const normalized = input.replace(/[^0-9.]/g, '');
  const value = parseFloat(normalized);
  if (Number.isNaN(value)) return 0;
  return Math.round(value * 100);
}

export function toCSV(expenses: Expense[]): string {
  const header = ["Date", "Amount", "Category", "Description"];
  const rows = expenses.map(e => [
    e.date,
    (e.amountCents / 100).toFixed(2),
    e.category,
    escapeCsv(e.description)
  ]);
  return [header.join(","), ...rows.map(r => r.join(","))].join("\n");
}

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function download(filename: string, content: string, type = "text/csv") {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
}
