"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const tabs = useMemo(() => ([
    { href: "/", label: "Dashboard" },
  ]), []);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur supports-[backdrop-filter]:bg-slate-950/40">
      <div className="container flex items-center gap-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          <span className="text-brand">Pro</span>Spend
        </Link>
        <nav className="flex items-center gap-1">
          {tabs.map(t => (
            <Link
              key={t.href}
              href={t.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                pathname === t.href
                  ? "bg-brand/20 text-brand border border-blue-700/50"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {t.label}
            </Link>
          ))}
          <a href="#add" className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60">Add Expense</a>
          <a href="#list" className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60">Expenses</a>
        </nav>
      </div>
    </header>
  );
}
