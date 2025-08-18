export type Category = 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Bills' | 'Other';

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  amountCents: number; // store as integer cents
  category: Category;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface Filters {
  startDate?: string;
  endDate?: string;
  category?: Category | 'All';
  search?: string;
}
