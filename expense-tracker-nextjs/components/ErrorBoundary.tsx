"use client";
import React from "react";

type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error("UI ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="card">
          <h3 className="font-semibold">Something went wrong</h3>
          <p className="text-sm text-slate-400">A client-side error occurred. Check the console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
