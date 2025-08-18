'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Plus, BarChart3 } from 'lucide-react';
import SummaryCards from '@/components/dashboard/SummaryCards';
import RecentExpenses from '@/components/dashboard/RecentExpenses';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import { storageService } from '@/lib/storage';
import { calculateExpenseSummary } from '@/lib/utils';
import { Expense } from '@/types';

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    setExpenses(storageService.getExpenses());
  }, []);

  const summary = calculateExpenseSummary(expenses);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Home className="h-6 w-6 mr-2 text-blue-600" />
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Overview of your expense tracking and spending patterns.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Expense
          </Link>
          <Link
            href="/analytics"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Analytics
          </Link>
        </div>
      </div>

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentExpenses expenses={summary.recentExpenses} />
        </div>
        <div className="lg:col-span-1">
          <CategoryBreakdown categorySummary={summary.categorySummary} />
        </div>
      </div>

      {expenses.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <div className="text-blue-600 mb-4">
            <BarChart3 className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Welcome to ExpenseTracker!
          </h3>
          <p className="text-blue-700 mb-6">
            Start tracking your expenses to see insights and analytics here.
          </p>
          <Link
            href="/add"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Expense
          </Link>
        </div>
      )}
    </div>
  );
}
