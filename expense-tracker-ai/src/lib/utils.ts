import { clsx, type ClassValue } from 'clsx';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { Expense, ExpenseFilters, ExpenseSummary, ExpenseCategory } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string): string {
  return format(parseISO(date), 'MMM dd, yyyy');
}

export function filterExpenses(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  return expenses.filter((expense) => {
    if (filters.category && expense.category !== filters.category) {
      return false;
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      if (
        !expense.description.toLowerCase().includes(searchLower) &&
        !expense.category.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    if (filters.startDate || filters.endDate) {
      const expenseDate = parseISO(expense.date);
      
      if (filters.startDate && expenseDate < parseISO(filters.startDate)) {
        return false;
      }
      
      if (filters.endDate && expenseDate > parseISO(filters.endDate)) {
        return false;
      }
    }

    return true;
  });
}

export function calculateExpenseSummary(expenses: Expense[]): ExpenseSummary {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
  });

  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categorySummary: Record<ExpenseCategory, number> = {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0,
  };

  expenses.forEach((expense) => {
    categorySummary[expense.category] += expense.amount;
  });

  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return {
    totalExpenses,
    monthlyTotal,
    categorySummary,
    recentExpenses,
  };
}

export function exportToCSV(expenses: Expense[]): string {
  const headers = ['Date', 'Amount', 'Category', 'Description'];
  const csvContent = [
    headers.join(','),
    ...expenses.map((expense) =>
      [
        expense.date,
        expense.amount,
        expense.category,
        `"${expense.description.replace(/"/g, '""')}"`,
      ].join(',')
    ),
  ].join('\n');

  return csvContent;
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}