"use client";

import { useMemo } from "react";
import { useExpenses } from "./ExpenseProvider";
import { fmtCurrency } from "@/lib/utils";
import { totalSpent, monthSpent, topCategories } from "@/lib/analytics";

export default function SummaryCards() {
  const { filtered } = useExpenses();
  const totals = useMemo(() => ({
    total: totalSpent(filtered),
    month: monthSpent(filtered, new Date()),
    top: topCategories(filtered, 3)
  }), [filtered]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="card">
        <p className="text-sm text-slate-400">Total Spent (filtered)</p>
        <p className="text-2xl font-bold mt-1">{fmtCurrency(totals.total)}</p>
      </div>
      <div className="card">
        <p className="text-sm text-slate-400">This Month</p>
        <p className="text-2xl font-bold mt-1">{fmtCurrency(totals.month)}</p>
      </div>
      <div className="card">
        <p className="text-sm text-slate-400 mb-2">Top Categories</p>
        <div className="space-y-2">
          {totals.top.length === 0 && <p className="text-slate-400 text-sm">No data</p>}
          {totals.top.map((c, i) => (
            <div key={c.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="badge">{i+1}</span>
                <span className="text-sm">{c.category}</span>
              </div>
              <div className="font-medium">{fmtCurrency(c.amountCents)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
