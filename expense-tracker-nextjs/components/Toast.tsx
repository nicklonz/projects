"use client";
import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

type Toast = { id: string, message: string };
type Ctx = { notify: (msg: string) => void };

const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("Toast used outside provider");
  return ctx;
}

export default function ToastHost({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const id = useRef(0);

  const notify = useCallback((message: string) => {
    const t = { id: String(id.current++), message };
    setToasts(prev => [...prev, t]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 2500);
  }, []);

  return (
    <ToastCtx.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className="card bg-slate-900/90 border border-slate-700 shadow-soft">
            <div className="text-sm">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
