'use client';

import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ExpenseSummary } from '@/types';

interface SummaryCardsProps {
  summary: ExpenseSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const topCategory = Object.entries(summary.categorySummary)
    .sort(([, a], [, b]) => b - a)
    .find(([, amount]) => amount > 0);

  const cards = [
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'All time total',
    },
    {
      title: 'This Month',
      value: formatCurrency(summary.monthlyTotal),
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Current month spending',
    },
    {
      title: 'Recent Expenses',
      value: summary.recentExpenses.length.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Last 5 transactions',
    },
    {
      title: 'Top Category',
      value: topCategory ? topCategory[0] : 'None',
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: topCategory ? formatCurrency(topCategory[1]) : 'No expenses',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mb-1">{card.value}</p>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}