'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Plus } from 'lucide-react';
import ExpenseForm from '@/components/forms/ExpenseForm';
import { storageService } from '@/lib/storage';
import { Expense } from '@/types';

export default function AddExpensePage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    storageService.addExpense(expenseData);
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Plus className="h-6 w-6 mr-2 text-blue-600" />
          Add New Expense
        </h1>
        <p className="text-gray-600 mt-2">
          Track your spending by adding a new expense entry.
        </p>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-sm font-medium text-green-800">
              Expense added successfully!
            </p>
          </div>
        </div>
      )}

      <ExpenseForm onSubmit={handleSubmit} />

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push('/expenses')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View all expenses →
        </button>
      </div>
    </div>
  );
}