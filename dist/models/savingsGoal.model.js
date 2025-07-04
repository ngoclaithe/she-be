"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingsGoalModel = void 0;
const uuid_1 = require("uuid");
class SavingsGoalModel {
    constructor() {
        this.savingsGoals = [];
        this.savingsGoals = [];
    }
    createSavingsGoal(userId, name, targetAmount, targetDate) {
        const newGoal = {
            id: (0, uuid_1.v4)(),
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
    getSavingsGoals(userId) {
        return this.savingsGoals.filter(goal => goal.userId === userId);
    }
    updateSavingsGoal(id, updates) {
        const goalIndex = this.savingsGoals.findIndex(goal => goal.id === id);
        if (goalIndex === -1)
            return null;
        this.savingsGoals[goalIndex] = { ...this.savingsGoals[goalIndex], ...updates };
        return this.savingsGoals[goalIndex];
    }
    deleteSavingsGoal(id) {
        const goalIndex = this.savingsGoals.findIndex(goal => goal.id === id);
        if (goalIndex === -1)
            return false;
        this.savingsGoals.splice(goalIndex, 1);
        return true;
    }
    contributeToSavingsGoal(id, amount) {
        const goal = this.savingsGoals.find(goal => goal.id === id);
        if (!goal)
            return null;
        goal.currentAmount += amount;
        return goal;
    }
    getSavingsGoalProgress(id) {
        const goal = this.savingsGoals.find(goal => goal.id === id);
        if (!goal)
            return null;
        return (goal.currentAmount / goal.targetAmount) * 100;
    }
}
exports.SavingsGoalModel = SavingsGoalModel;
