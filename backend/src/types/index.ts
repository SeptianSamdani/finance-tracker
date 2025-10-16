// User Types
export interface User {
  id: number;
  email: string;
  password: string;
  full_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  created_at: Date;
}

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

// Category Types
export interface Category {
  id: number;
  user_id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryInput {
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
}

// Transaction Types
export interface Transaction {
  id: number;
  user_id: number;
  category_id: number | null;
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  transaction_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface TransactionWithCategory extends Transaction {
  category_name?: string;
  category_color?: string;
  category_icon?: string;
}

export interface TransactionInput {
  category_id?: number;
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  transaction_date: string;
}

export interface TransactionFilter {
  type?: 'income' | 'expense';
  category_id?: number;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
}

// Budget Types
export interface Budget {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  period: 'monthly' | 'yearly';
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface BudgetWithCategory extends Budget {
  category_name: string;
  category_color: string;
  spent_amount: number;
  remaining_amount: number;
  percentage_used: number;
}

export interface BudgetInput {
  category_id: number;
  amount: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
}

// Dashboard/Analytics Types
export interface DashboardSummary {
  total_income: number;
  total_expense: number;
  balance: number;
  income_count: number;
  expense_count: number;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryStats {
  category_id: number;
  category_name: string;
  category_color: string;
  total_amount: number;
  transaction_count: number;
  percentage: number;
}

export interface RecentTransaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  category_name: string;
  category_color: string;
  transaction_date: Date;
}

// Express Request Extension
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}