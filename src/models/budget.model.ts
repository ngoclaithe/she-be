import { v4 as uuidv4 } from 'uuid';

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: Date;
  createdAt: Date;
}

export class BudgetModel {
  constructor(
    public id: string = uuidv4(),
    public userId: string,
    public categoryId: string,
    public amount: number,
    public month: Date = new Date(),
    public createdAt: Date = new Date()
  ) {}
}