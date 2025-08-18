"use client";

import { useExpenses } from "./ExpenseProvider";
import ExpenseForm from "./ExpenseForm";
import Filters from "./Filters";
import SummaryCards from "./SummaryCards";
import dynamic from "next/dynamic";
import ErrorBoundary from "./ErrorBoundary";
const Charts = dynamic(() => import("./Charts"), { ssr: false });

export default function Dashboard() {
  const { state } = useExpenses();

  if (!state.loaded) {
    return (
      <div className="space-y-3">
        <div className="h-12 card animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="h-28 card animate-pulse" />
          <div className="h-28 card animate-pulse" />
          <div className="h-28 card animate-pulse" />
        </div>
        <div className="h-80 card animate-pulse" />
        <div className="h-80 card animate-pulse" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <div className="space-y-4">
      <section className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-slate-400">Track your spending with summaries, filters, and charts.</p>
          </div>
          <a href="#add" className="btn btn-primary">Add Expense</a>
        </div>
      </section>

      <SummaryCards />

      <Charts />

      <Filters />

      <section id="add" className="card">
        <h3 className="font-semibold mb-3">Add Expense</h3>
        <ExpenseForm />
      </section>

      <section>
        <ExpenseList />
      </section>
    </div>
    </ErrorBoundary>
  );
}

function ExpenseList() {
  const Comp = require("./ExpenseList").default;
  return <Comp />;
}
