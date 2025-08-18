'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, parseISO, isWithinInterval, subMonths } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { Expense, ExpenseCategory } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';

interface SpendingChartProps {
  expenses: Expense[];
}

type ChartType = 'monthly' | 'category';

export default function SpendingChart({ expenses }: SpendingChartProps) {
  const [chartType, setChartType] = useState<ChartType>('monthly');

  const getMonthlyData = () => {
    const now = new Date();
    const startDate = subMonths(now, 5);
    const months = eachMonthOfInterval({ start: startDate, end: now });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
      });

      const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      return {
        month: format(month, 'MMM yyyy'),
        total,
        count: monthlyExpenses.length,
      };
    });
  };

  const getCategoryData = () => {
    const categoryTotals: Record<ExpenseCategory, number> = {
      Food: 0,
      Transportation: 0,
      Entertainment: 0,
      Shopping: 0,
      Bills: 0,
      Other: 0,
    };

    expenses.forEach(expense => {
      categoryTotals[expense.category] += expense.amount;
    });

    const colors = {
      Food: '#10B981',
      Transportation: '#3B82F6',
      Entertainment: '#8B5CF6',
      Shopping: '#EC4899',
      Bills: '#EF4444',
      Other: '#6B7280',
    };

    return Object.entries(categoryTotals)
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category,
        amount,
        color: colors[category as ExpenseCategory],
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();

  const CustomTooltip = ({ active, payload, label }: { 
    active?: boolean; 
    payload?: Array<{ value: number; payload: { count?: number } }>; 
    label?: string 
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Total: {formatCurrency(payload[0].value)}
          </p>
          {chartType === 'monthly' && payload[0].payload.count && (
            <p className="text-gray-600 text-sm">
              {payload[0].payload.count} expenses
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: { 
    active?: boolean; 
    payload?: Array<{ value: number; payload: { category: string } }> 
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{payload[0].payload.category}</p>
          <p className="text-blue-600">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          {chartType === 'monthly' ? (
            <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
          ) : (
            <PieChartIcon className="h-5 w-5 text-gray-400 mr-2" />
          )}
          Spending Analysis
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('monthly')}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded-md transition-colors',
              chartType === 'monthly'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600'
            )}
          >
            Monthly Trend
          </button>
          <button
            onClick={() => setChartType('category')}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded-md transition-colors',
              chartType === 'category'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600'
            )}
          >
            By Category
          </button>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-300 mb-4">
            {chartType === 'monthly' ? (
              <BarChart3 className="h-16 w-16 mx-auto" />
            ) : (
              <PieChartIcon className="h-16 w-16 mx-auto" />
            )}
          </div>
          <p className="text-gray-600">No data available for chart visualization</p>
        </div>
      ) : (
        <div className="h-80">
          {chartType === 'monthly' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="total" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  );
}