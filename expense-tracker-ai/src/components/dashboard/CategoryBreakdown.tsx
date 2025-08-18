'use client';

import { PieChart } from 'lucide-react';
import { ExpenseCategory } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CategoryBreakdownProps {
  categorySummary: Record<ExpenseCategory, number>;
}

export default function CategoryBreakdown({ categorySummary }: CategoryBreakdownProps) {
  const totalAmount = Object.values(categorySummary).reduce((sum, amount) => sum + amount, 0);

  const categoryData = Object.entries(categorySummary)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
    }));

  const getCategoryColor = (category: string) => {
    const colors = {
      Food: 'bg-green-500',
      Transportation: 'bg-blue-500',
      Entertainment: 'bg-purple-500',
      Shopping: 'bg-pink-500',
      Bills: 'bg-red-500',
      Other: 'bg-gray-500',
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  const getCategoryTextColor = (category: string) => {
    const colors = {
      Food: 'text-green-700',
      Transportation: 'text-blue-700',
      Entertainment: 'text-purple-700',
      Shopping: 'text-pink-700',
      Bills: 'text-red-700',
      Other: 'text-gray-700',
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <PieChart className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Spending by Category</h3>
      </div>

      {categoryData.length === 0 ? (
        <div className="text-center py-8">
          <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No expense data to display</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categoryData.map(({ category, amount, percentage }) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${getCategoryTextColor(category)}`}>
                  {category}
                </span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(amount)}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getCategoryColor(category)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Total</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}