'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react';
import SpendingChart from '@/components/charts/SpendingChart';
import { storageService } from '@/lib/storage';
import { calculateExpenseSummary, formatCurrency } from '@/lib/utils';
import { Expense } from '@/types';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO, subMonths } from 'date-fns';

export default function AnalyticsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    setExpenses(storageService.getExpenses());
  }, []);

  const summary = calculateExpenseSummary(expenses);
  
  const getMonthlyComparison = () => {
    const now = new Date();
    const thisMonth = { start: startOfMonth(now), end: endOfMonth(now) };
    const lastMonth = { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) };

    const thisMonthExpenses = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, thisMonth);
    });

    const lastMonthExpenses = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, lastMonth);
    });

    const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const change = thisMonthTotal - lastMonthTotal;
    const percentChange = lastMonthTotal > 0 ? (change / lastMonthTotal) * 100 : 0;

    return {
      thisMonth: thisMonthTotal,
      lastMonth: lastMonthTotal,
      change,
      percentChange,
      isIncrease: change > 0,
    };
  };

  const getInsights = () => {
    if (expenses.length === 0) return [];

    const insights = [];
    const topCategory = Object.entries(summary.categorySummary)
      .sort(([, a], [, b]) => b - a)
      .find(([, amount]) => amount > 0);

    if (topCategory) {
      const percentage = (topCategory[1] / summary.totalExpenses) * 100;
      insights.push({
        title: 'Top Spending Category',
        description: `${topCategory[0]} accounts for ${percentage.toFixed(1)}% of your total expenses`,
        value: formatCurrency(topCategory[1]),
        icon: Target,
        color: 'text-blue-600',
      });
    }

    const monthlyComparison = getMonthlyComparison();
    if (monthlyComparison.lastMonth > 0) {
      insights.push({
        title: 'Monthly Comparison',
        description: `${monthlyComparison.isIncrease ? 'Increased' : 'Decreased'} by ${Math.abs(monthlyComparison.percentChange).toFixed(1)}% from last month`,
        value: `${monthlyComparison.isIncrease ? '+' : ''}${formatCurrency(monthlyComparison.change)}`,
        icon: TrendingUp,
        color: monthlyComparison.isIncrease ? 'text-red-600' : 'text-green-600',
      });
    }

    const avgDaily = summary.totalExpenses / Math.max(1, expenses.length);
    insights.push({
      title: 'Average Per Expense',
      description: 'Your typical spending amount per transaction',
      value: formatCurrency(avgDaily),
      icon: Calendar,
      color: 'text-purple-600',
    });

    return insights;
  };

  const monthlyComparison = getMonthlyComparison();
  const insights = getInsights();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
          Analytics
        </h1>
        <p className="text-gray-600 mt-2">
          Detailed insights and visual analysis of your spending patterns.
        </p>
      </div>

      {expenses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600 mb-6">
            Add some expenses to see detailed analytics and insights.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`h-6 w-6 ${insight.color}`} />
                    <span className={`text-xl font-semibold ${insight.color}`}>
                      {insight.value}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {insight.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SpendingChart expenses={expenses} />
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                Monthly Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-blue-900">This Month</p>
                    <p className="text-2xl font-semibold text-blue-600">
                      {formatCurrency(monthlyComparison.thisMonth)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-700">
                      {format(new Date(), 'MMMM yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Last Month</p>
                    <p className="text-2xl font-semibold text-gray-600">
                      {formatCurrency(monthlyComparison.lastMonth)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {format(subMonths(new Date(), 1), 'MMMM yyyy')}
                    </p>
                  </div>
                </div>

                {monthlyComparison.lastMonth > 0 && (
                  <div className={`flex justify-between items-center p-4 rounded-lg ${
                    monthlyComparison.isIncrease ? 'bg-red-50' : 'bg-green-50'
                  }`}>
                    <div>
                      <p className={`text-sm font-medium ${
                        monthlyComparison.isIncrease ? 'text-red-900' : 'text-green-900'
                      }`}>
                        Change
                      </p>
                      <p className={`text-xl font-semibold ${
                        monthlyComparison.isIncrease ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {monthlyComparison.isIncrease ? '+' : ''}{formatCurrency(monthlyComparison.change)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        monthlyComparison.isIncrease ? 'text-red-700' : 'text-green-700'
                      }`}>
                        {monthlyComparison.isIncrease ? '+' : ''}{monthlyComparison.percentChange.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}