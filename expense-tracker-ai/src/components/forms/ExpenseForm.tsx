'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, DollarSign, Save, X } from 'lucide-react';
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export default function ExpenseForm({ expense, onSubmit, onCancel, isEditing = false }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: expense?.amount?.toString() || '',
    category: expense?.category || ('Food' as ExpenseCategory),
    description: expense?.description || '',
    date: expense?.date || format(new Date(), 'yyyy-MM-dd'),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        amount: Number(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        date: formData.date,
      });

      if (!isEditing) {
        setFormData({
          amount: '',
          category: 'Food',
          description: '',
          date: format(new Date(), 'yyyy-MM-dd'),
        });
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <DollarSign className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={cn(
                  'block w-full pl-10 pr-3 py-2 border rounded-md text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.amount
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                )}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={cn(
                'block w-full px-3 py-2 border rounded-md text-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'border-gray-300 bg-white'
              )}
            >
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={cn(
                'block w-full pl-10 pr-3 py-2 border rounded-md text-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors.date
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              )}
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={cn(
              'block w-full px-3 py-2 border rounded-md text-sm resize-none',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              errors.description
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-white'
            )}
            placeholder="Enter expense description..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md',
                'text-gray-700 bg-white border border-gray-300',
                'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-1 inline" />
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md',
              'text-white bg-blue-600 border border-transparent',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-1 inline" />
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}