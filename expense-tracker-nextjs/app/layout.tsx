import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { ExpenseProvider } from "@/components/ExpenseProvider";
import ToastHost from "@/components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProSpend — Expense Tracker",
  description: "A modern, professional expense tracking app built with Next.js 14, TypeScript, and Tailwind CSS."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastHost>
          <ExpenseProvider>
            <Navbar />
            <main className="container py-6">{children}</main>
          </ExpenseProvider>
        </ToastHost>
      </body>
    </html>
  );
}
