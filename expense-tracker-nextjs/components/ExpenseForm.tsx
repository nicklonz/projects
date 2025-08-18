"use client";

import { useState } from "react";
import { z } from "zod";
import { CATEGORIES, fmtCurrency, parseAmountToCents } from "@/lib/utils";
import { useExpenses } from "./ExpenseProvider";
import { useToast } from "./Toast";
import type { Category, Expense } from "@/lib/types";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  amount: z.string().min(1, "Amount is required").refine(val => !Number.isNaN(parseFloat(val)) && parseFloat(val) > 0, "Enter a valid positive number"),
  category: z.enum(["Food", "Transportation", "Entertainment", "Shopping", "Bills", "Other"]),
  description: z.string().min(1, "Description is required")
});

export default function ExpenseForm({ initial, onDone }: { initial?: Expense; onDone?: () => void }) {
  const { add, edit } = useExpenses();
  const { notify } = useToast();

  const [form, setForm] = useState({
    date: initial?.date ?? new Date().toISOString().slice(0,10),
    amount: initial ? (initial.amountCents / 100).toFixed(2) : "",
    category: (initial?.category ?? "Food") as Category,
    description: initial?.description ?? ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = schema.safeParse(form);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach(i => { errs[i.path[0]?.toString() || "form"] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const data = res.data;
      const cents = parseAmountToCents(data.amount);
      if (cents <= 0) {
        setErrors({ amount: "Amount must be greater than zero" });
        setSubmitting(false);
        return;
      }
      if (initial) {
        edit(initial.id, { date: data.date, amountCents: cents, category: data.category, description: data.description });
        notify("Expense updated");
      } else {
        add({ date: data.date, amountCents: cents, category: data.category, description: data.description });
        notify("Expense added");
      }
      setForm({
        date: new Date().toISOString().slice(0,10),
        amount: "",
        category: "Food",
        description: ""
      });
      onDone?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-slate-300">Date</label>
          <input
            type="date"
            className="input mt-1"
            value={form.date}
            onChange={e => setForm(v => ({ ...v, date: e.target.value }))}
          />
          {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date}</p>}
        </div>
        <div>
          <label className="text-sm text-slate-300">Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="input mt-1"
            value={form.amount}
            onChange={e => setForm(v => ({ ...v, amount: e.target.value }))}
            onBlur={() => {
              const cents = parseAmountToCents(form.amount);
              if (cents > 0) setForm(v => ({ ...v, amount: (cents/100).toFixed(2) }));
            }}
          />
          {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount}</p>}
        </div>
        <div>
          <label className="text-sm text-slate-300">Category</label>
          <select
            className="select mt-1"
            value={form.category}
            onChange={e => setForm(v => ({ ...v, category: e.target.value as Category }))}
          >
            {CATEGORIES.map(c => (<option key={c} value={c}>{c}</option>))}
          </select>
          {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
        </div>
        <div>
          <label className="text-sm text-slate-300">Description</label>
          <input
            className="input mt-1"
            placeholder="What did you spend on?"
            value={form.description}
            onChange={e => setForm(v => ({ ...v, description: e.target.value }))}
          />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn btn-primary disabled:opacity-50" disabled={submitting} type="submit">
          {initial ? "Save Changes" : "Add Expense"}
        </button>
        {form.amount && <span className="badge">= {fmtCurrency(parseAmountToCents(form.amount))}</span>}
      </div>
    </form>
  );
}
