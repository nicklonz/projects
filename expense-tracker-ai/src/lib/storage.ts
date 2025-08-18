import { Expense } from '@/types';

const STORAGE_KEY = 'expense-tracker-expenses';

export const storageService = {
  getExpenses(): Expense[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading expenses from localStorage:', error);
      return [];
    }
  },

  saveExpenses(expenses: Expense[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses to localStorage:', error);
    }
  },

  addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Expense {
    const expenses = this.getExpenses();
    const now = new Date().toISOString();
    
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    expenses.push(newExpense);
    this.saveExpenses(expenses);
    
    return newExpense;
  },

  updateExpense(id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>): Expense | null {
    const expenses = this.getExpenses();
    const index = expenses.findIndex(expense => expense.id === id);
    
    if (index === -1) return null;
    
    const updatedExpense: Expense = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    expenses[index] = updatedExpense;
    this.saveExpenses(expenses);
    
    return updatedExpense;
  },

  deleteExpense(id: string): boolean {
    const expenses = this.getExpenses();
    const filteredExpenses = expenses.filter(expense => expense.id !== id);
    
    if (filteredExpenses.length === expenses.length) return false;
    
    this.saveExpenses(filteredExpenses);
    return true;
  },

  clearAllExpenses(): void {
    this.saveExpenses([]);
  }
};