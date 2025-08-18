"use client";

import { useExpenses } from "./ExpenseProvider";
import { CATEGORIES } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { Category } from "@/lib/types";

export default function Filters() {
  const { state, setFilters } = useExpenses();
  const [local, setLocal] = useState({
    startDate: state.filters.startDate || "",
    endDate: state.filters.endDate || "",
    category: (state.filters.category || "All") as Category | "All",
    search: state.filters.search || ""
  });

  useEffect(() => {
    setLocal({
      startDate: state.filters.startDate || "",
      endDate: state.filters.endDate || "",
      category: (state.filters.category || "All") as Category | "All",
      search: state.filters.search || ""
    });
  }, [state.filters]);

  const apply = () => setFilters(local);

  const reset = () => {
    const cleared = { startDate: "", endDate: "", category: "All" as const, search: "" };
    setLocal(cleared);
    setFilters(cleared);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="font-semibold">Filters</h3>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline" onClick={reset}>Reset</button>
          <button className="btn btn-primary" onClick={apply}>Apply</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="text-sm text-slate-300">Start Date</label>
          <input type="date" className="input mt-1" value={local.startDate} onChange={e => setLocal(v => ({ ...v, startDate: e.target.value }))} />
        </div>
        <div>
          <label className="text-sm text-slate-300">End Date</label>
          <input type="date" className="input mt-1" value={local.endDate} onChange={e => setLocal(v => ({ ...v, endDate: e.target.value }))} />
        </div>
        <div>
          <label className="text-sm text-slate-300">Category</label>
          <select className="select mt-1" value={local.category} onChange={e => setLocal(v => ({ ...v, category: e.target.value as any }))}>
            <option value="All">All</option>
            {CATEGORIES.map(c => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-300">Search</label>
          <input className="input mt-1" placeholder="Description contains..." value={local.search} onChange={e => setLocal(v => ({ ...v, search: e.target.value }))} />
        </div>
      </div>
    </div>
  );
}
