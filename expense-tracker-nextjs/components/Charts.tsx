"use client";

import { useMemo } from "react";
import { useExpenses } from "./ExpenseProvider";
import { monthlyTotals, byCategory } from "@/lib/analytics";
import { fmtCurrency } from "@/lib/utils";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell
} from "recharts";

export default function Charts() {
  const { filtered } = useExpenses();
  const monthly = useMemo(() => monthlyTotals(filtered, 6, new Date()), [filtered]);
  const categories = useMemo(() => byCategory(filtered), [filtered]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="card h-80">
        <p className="text-sm text-slate-400 mb-2">Spending (Last 6 Months)</p>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={monthly}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis tickFormatter={(v) => `$${Math.round(v/100)}`} stroke="#94a3b8" />
            <Tooltip formatter={(v: any) => fmtCurrency(Number(v))} contentStyle={{ background: "#0f172a", border: "1px solid #1f2937" }} />
            <Bar dataKey="amountCents" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card h-80">
        <p className="text-sm text-slate-400 mb-2">By Category</p>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie data={categories} dataKey="amountCents" nameKey="category" outerRadius={110}>
              {categories.map((_, i) => (<Cell key={i} />))}
            </Pie>
            <Tooltip formatter={(v: any) => fmtCurrency(Number(v))} contentStyle={{ background: "#0f172a", border: "1px solid #1f2937" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
