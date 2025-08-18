'use client';

import { useState, useEffect } from 'react';
import { List, Trash2, CheckCircle } from 'lucide-react';
import ExpenseList from '@/components/expenses/ExpenseList';
import ExpenseForm from '@/components/forms/ExpenseForm';
import { storageService } from '@/lib/storage';
import { Expense } from '@/types';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  useEffect(() => {
    setExpenses(storageService.getExpenses());
  }, []);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleUpdate = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingExpense) return;

    const updated = storageService.updateExpense(editingExpense.id, expenseData);
    if (updated) {
      setExpenses(storageService.getExpenses());
      setEditingExpense(null);
      setShowSuccess('Expense updated successfully!');
      setTimeout(() => setShowSuccess(null), 3000);
    }
  };

  const handleDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (!showDeleteConfirm) return;

    const success = storageService.deleteExpense(showDeleteConfirm);
    if (success) {
      setExpenses(storageService.getExpenses());
      setShowDeleteConfirm(null);
      setShowSuccess('Expense deleted successfully!');
      setTimeout(() => setShowSuccess(null), 3000);
    }
  };

  const cancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <List className="h-6 w-6 mr-2 text-blue-600" />
          All Expenses
        </h1>
        <p className="text-gray-600 mt-2">
          View, search, and manage all your expenses.
        </p>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-sm font-medium text-green-800">{showSuccess}</p>
          </div>
        </div>
      )}

      {editingExpense && (
        <div className="mb-8">
          <ExpenseForm
            expense={editingExpense}
            onSubmit={handleUpdate}
            onCancel={cancelEdit}
            isEditing={true}
          />
        </div>
      )}

      <ExpenseList
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <Trash2 className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Delete Expense</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this expense? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}