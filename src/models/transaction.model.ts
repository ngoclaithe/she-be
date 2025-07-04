import { v4 as uuidv4 } from 'uuid';

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

export class TransactionModel {
  constructor(
    public id: string = uuidv4(),
    public userId: string,
    public categoryId: string,
    public amount: number,
    public type: 'income' | 'expense',
    public description?: string,
    public date: Date = new Date(),
    public createdAt: Date = new Date()
  ) {}
}