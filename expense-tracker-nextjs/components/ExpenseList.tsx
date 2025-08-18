"use client";

import { useState } from "react";
import { fmtCurrency, toCSV, download } from "@/lib/utils";
import { useExpenses } from "./ExpenseProvider";
import ExpenseForm from "./ExpenseForm";
import Modal from "./Modal";
import { useToast } from "./Toast";

export default function ExpenseList() {
  const { filtered, remove } = useExpenses();
  const [editingId, setEditingId] = useState<string | null>(null);
  const { state } = useExpenses();
  const { notify } = useToast();

  const editing = filtered.find(e => e.id === editingId) || null;

  const onExport = () => {
    try {
      const csv = toCSV(filtered);
      const suffix = (state.filters.startDate || state.filters.endDate || state.filters.category || state.filters.search) ? "-filtered" : "-all";
      download(`expenses${suffix}.csv`, csv, "text/csv;charset=utf-8");
      notify("Exported CSV");
    } catch (e) {
      console.error("CSV export failed", e);
      notify("CSV export failed. Check console.");
    }
  };

  return (
    <div id="list" className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Expenses</h3>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline" onClick={onExport}>Export CSV</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="w-[110px]">Date</th>
              <th>Description</th>
              <th className="w-[140px]">Category</th>
              <th className="w-[110px] text-right">Amount</th>
              <th className="w-[120px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400">No expenses match your filters.</td>
              </tr>
            )}
            {filtered.map(e => (
              <tr key={e.id}>
                <td className="whitespace-nowrap">{e.date}</td>
                <td>{e.description}</td>
                <td><span className="badge">{e.category}</span></td>
                <td className="text-right font-medium">{fmtCurrency(e.amountCents)}</td>
                <td className="text-right">
                  <div className="flex gap-2 justify-end">
                    <button className="btn btn-outline" onClick={() => setEditingId(e.id)}>Edit</button>
                    <button className="btn btn-outline text-red-300 hover:text-red-200 hover:bg-red-950/40 border-red-900" onClick={() => remove(e.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editing} onClose={() => setEditingId(null)} title="Edit Expense">
        {editing && <ExpenseForm initial={editing} onDone={() => setEditingId(null)} />}
      </Modal>
    </div>
  );
}
