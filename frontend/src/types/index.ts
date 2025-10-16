// Auth Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
}

// Category Types
export interface Category {
  id: number;
  user_id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

// Transaction Types
export interface Transaction {
  id: number;
  user_id: number;
  category_id: number | null;
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  transaction_date: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionInput {
  category_id?: number;
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  transaction_date: string;
}

// Budget Types
export interface Budget {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  category_name: string;
  category_color: string;
  spent_amount: number;
  remaining_amount: number;
  percentage_used: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetInput {
  category_id: number;
  amount: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
}

// Dashboard Types
export interface DashboardSummary {
  total_transactions: number;
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryBreakdown {
  id: number;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense';
  total_amount: number;
  transaction_count: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  monthly_trend: MonthlyTrend[];
  category_breakdown: CategoryBreakdown[];
  recent_transactions: Transaction[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}