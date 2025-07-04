import { v4 as uuidv4 } from 'uuid';

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  createdAt: Date;
}

export class SavingsGoalModel {
  private savingsGoals: SavingsGoal[] = [];

  constructor() {
    this.savingsGoals = [];
  }

  createSavingsGoal(userId: string, name: string, targetAmount: number, targetDate: Date): SavingsGoal {
    const newGoal: SavingsGoal = {
      id: uuidv4(),
      userId,
      name,
      targetAmount,
      currentAmount: 0,
      targetDate,
      createdAt: new Date(),
    };
    this.savingsGoals.push(newGoal);
    return newGoal;
  }

  getSavingsGoals(userId: string): SavingsGoal[] {
    return this.savingsGoals.filter(goal => goal.userId === userId);
  }

  updateSavingsGoal(id: string, updates: Partial<SavingsGoal>): SavingsGoal | null {
    const goalIndex = this.savingsGoals.findIndex(goal => goal.id === id);
    if (goalIndex === -1) return null;

    this.savingsGoals[goalIndex] = { ...this.savingsGoals[goalIndex], ...updates };
    return this.savingsGoals[goalIndex];
  }

  deleteSavingsGoal(id: string): boolean {
    const goalIndex = this.savingsGoals.findIndex(goal => goal.id === id);
    if (goalIndex === -1) return false;

    this.savingsGoals.splice(goalIndex, 1);
    return true;
  }

  contributeToSavingsGoal(id: string, amount: number): SavingsGoal | null {
    const goal = this.savingsGoals.find(goal => goal.id === id);
    if (!goal) return null;

    goal.currentAmount += amount;
    return goal;
  }

  getSavingsGoalProgress(id: string): number | null {
    const goal = this.savingsGoals.find(goal => goal.id === id);
    if (!goal) return null;

    return (goal.currentAmount / goal.targetAmount) * 100;
  }
}