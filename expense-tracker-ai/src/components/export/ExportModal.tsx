'use client';

import { useState } from 'react';
import { X, Download, FileText, Database, FileSpreadsheet, Calendar, Filter, Eye, Settings, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from '@/types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  onExport: (data: ExportData) => Promise<void>;
}

interface ExportFilters {
  startDate: string;
  endDate: string;
  categories: ExpenseCategory[];
  filename: string;
  format: 'csv' | 'json' | 'pdf';
}

interface ExportData {
  expenses: Expense[];
  filters: ExportFilters;
}

export default function ExportModal({ isOpen, onClose, expenses, onExport }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<'filters' | 'preview'>('filters');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ExportFilters>({
    startDate: '',
    endDate: '',
    categories: [...EXPENSE_CATEGORIES],
    filename: `expenses-export-${format(new Date(), 'yyyy-MM-dd')}`,
    format: 'csv'
  });

  const filteredExpenses = expenses.filter(expense => {
    // Date filtering
    if (filters.startDate && expense.date < filters.startDate) return false;
    if (filters.endDate && expense.date > filters.endDate) return false;
    
    // Category filtering
    if (!filters.categories.includes(expense.category)) return false;
    
    return true;
  });

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Comma-separated values file' },
    { value: 'json', label: 'JSON', icon: Database, description: 'JavaScript object notation file' },
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Portable document format file' }
  ] as const;

  const handleCategoryToggle = (category: ExpenseCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSelectAllCategories = () => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.length === EXPENSE_CATEGORIES.length ? [] : [...EXPENSE_CATEGORIES]
    }));
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      await onExport({
        expenses: filteredExpenses,
        filters
      });
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
                <p className="text-sm text-gray-600">Export your expense data with advanced filtering options</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('filters')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
                activeTab === 'filters'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Configure Export</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
                activeTab === 'preview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>Preview Data</span>
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                {filteredExpenses.length}
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'filters' ? (
              <div className="space-y-6">
                {/* Export Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {formatOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => setFilters(prev => ({ ...prev, format: option.value }))}
                          className={`p-4 border rounded-lg text-left transition-all ${
                            filters.format === option.value
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <Icon className="h-5 w-5 text-gray-600 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-900">{option.label}</div>
                              <div className="text-sm text-gray-600">{option.description}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                    <span className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Categories
                    </span>
                    <button
                      onClick={handleSelectAllCategories}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {filters.categories.length === EXPENSE_CATEGORIES.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {EXPENSE_CATEGORIES.map((category) => (
                      <label key={category} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filename */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filename
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={filters.filename}
                      onChange={(e) => setFilters(prev => ({ ...prev, filename: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter filename"
                    />
                    <span className="text-sm text-gray-500 px-2 py-2 bg-gray-50 rounded-lg">
                      .{filters.format}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Preview Tab */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">Export Preview</h4>
                  <div className="text-sm text-gray-600">
                    {filteredExpenses.length} of {expenses.length} expenses will be exported
                  </div>
                </div>

                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 mb-2">
                      <Database className="h-12 w-12 mx-auto mb-4" />
                      No expenses match the current filters
                    </div>
                    <p className="text-sm text-gray-600">
                      Try adjusting your date range or category selection
                    </p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-96">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-900">Date</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-900">Category</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-900">Amount</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-900">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredExpenses.slice(0, 50).map((expense) => (
                            <tr key={expense.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-900">
                                {format(new Date(expense.date), 'MMM dd, yyyy')}
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {expense.category}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-900">
                                ${expense.amount.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                                {expense.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredExpenses.length > 50 && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                        Showing first 50 of {filteredExpenses.length} expenses
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between rounded-b-lg">
            <div className="text-sm text-gray-600">
              {filteredExpenses.length > 0 && (
                <>
                  Total: ${filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)} 
                  • {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
                </>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={filteredExpenses.length === 0 || isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                <span>{isLoading ? 'Exporting...' : 'Export Data'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}