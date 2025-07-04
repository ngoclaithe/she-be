export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  color?: string;
  type: 'income' | 'expense';
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  description?: string;
  type: 'income' | 'expense';
  date: Date;
  createdAt: Date;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  createdAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: Date;
  createdAt: Date;
}
declare namespace Express {
    export interface Request {
        user?: { id: string };
    }
}