"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { Expense, Filters, Category } from "@/lib/types";
import { loadExpenses, saveExpenses } from "@/lib/storage";

type State = {
  expenses: Expense[];
  filters: Filters;
  loaded: boolean;
};

type AddPayload = Omit<Expense, "id" | "createdAt" | "updatedAt">;
type EditPayload = { id: string; patch: Partial<Omit<Expense, "id" | "createdAt">> };

type Action =
  | { type: "INIT"; expenses: Expense[] }
  | { type: "ADD"; expense: Expense }
  | { type: "EDIT"; id: string; patch: Partial<Omit<Expense, "id" | "createdAt">> }
  | { type: "DELETE"; id: string }
  | { type: "FILTER"; filters: Partial<Filters> };

const ExpenseCtx = createContext<{
  state: State;
  filtered: Expense[];
  add: (data: AddPayload) => void;
  edit: (id: string, patch: EditPayload["patch"]) => void;
  remove: (id: string) => void;
  setFilters: (f: Partial<Filters>) => void;
} | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT":
      return { ...state, loaded: true, expenses: action.expenses };
    case "ADD":
      return { ...state, expenses: [action.expense, ...state.expenses] };
    case "EDIT":
      return {
        ...state,
        expenses: state.expenses.map(e => e.id === action.id ? { ...e, ...action.patch, updatedAt: Date.now() } : e)
      };
    case "DELETE":
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.id) };
    case "FILTER":
      return { ...state, filters: { ...state.filters, ...action.filters } };
    default:
      return state;
  }
}

function applyFilters(expenses: Expense[], f: Filters) {
  let out = expenses.slice();
  if (f.startDate) out = out.filter(e => e.date >= f.startDate!);
  if (f.endDate) out = out.filter(e => e.date <= f.endDate!);
  if (f.category && f.category !== "All") out = out.filter(e => e.category === f.category);
  if (f.search && f.search.trim()) {
    const s = f.search.toLowerCase();
    out = out.filter(e => e.description.toLowerCase().includes(s));
  }
  // sort newest first
  out.sort((a,b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt));
  return out;
}

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { expenses: [], filters: { category: "All" }, loaded: false });

  useEffect(() => {
    const data = loadExpenses();
    dispatch({ type: "INIT", expenses: data });
  }, []);

  useEffect(() => {
    if (state.loaded) saveExpenses(state.expenses);
  }, [state.expenses, state.loaded]);

  const filtered = useMemo(() => applyFilters(state.expenses, state.filters), [state.expenses, state.filters]);

  const add = (data: AddPayload) => {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Math.random()).slice(2);
    const now = Date.now();
    const expense: Expense = { id, createdAt: now, updatedAt: now, ...data };
    dispatch({ type: "ADD", expense });
  };
  const edit = (id: string, patch: EditPayload["patch"]) => dispatch({ type: "EDIT", id, patch });
  const remove = (id: string) => dispatch({ type: "DELETE", id });
  const setFilters = (filters: Partial<Filters>) => dispatch({ type: "FILTER", filters });

  const value = useMemo(() => ({ state, filtered, add, edit, remove, setFilters }), [state, filtered]);

  return <ExpenseCtx.Provider value={value}>{children}</ExpenseCtx.Provider>;
}

export function useExpenses() {
  const ctx = useContext(ExpenseCtx);
  if (!ctx) throw new Error("useExpenses must be used within ExpenseProvider");
  return ctx;
}
