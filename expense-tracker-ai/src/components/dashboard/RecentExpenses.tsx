'use client';

import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { Expense } from '@/types';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

interface RecentExpensesProps {
  expenses: Expense[];
}

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      Food: 'bg-green-100 text-green-800',
      Transportation: 'bg-blue-100 text-blue-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Shopping: 'bg-pink-100 text-pink-800',
      Bills: 'bg-red-100 text-red-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Recent Expenses</h3>
        </div>
        <Link
          href="/expenses"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          View all
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h4>
          <p className="text-gray-600 mb-4">Start tracking your expenses to see them here.</p>
          <Link
            href="/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add your first expense
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <span className={cn(
                    'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                    getCategoryColor(expense.category)
                  )}>
                    {expense.category}
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(expense.date)}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 mt-1 truncate">
                  {expense.description}
                </p>
              </div>
              <div className="text-lg font-semibold text-gray-900 ml-4">
                {formatCurrency(expense.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}