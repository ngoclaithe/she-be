import { Request, Response } from 'express';
import * as budgetService from '../services/budget.service';

export const getBudgetsByMonth = async (req: Request, res: Response) => {
    try {
        const { month } = req.query;
        const budgets = await budgetService.getBudgetsByMonth(req.user!.id, month as string);
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving budgets', error });
    }
};

export const createBudget = async (req: Request, res: Response) => {
    try {
        const { categoryId, amount, month } = req.body;
        const newBudget = await budgetService.createBudget(req.user!.id, categoryId, Number(amount), month);
        res.status(201).json(newBudget);
    } catch (error) {
        res.status(500).json({ message: 'Error creating budget', error });
    }
};

export const updateBudget = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount } = req.body;
    try {
        const updatedBudget = await budgetService.updateBudget(id, Number(amount));
        res.status(200).json(updatedBudget);
    } catch (error) {
        res.status(500).json({ message: 'Error updating budget', error });
    }
};

export const deleteBudget = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await budgetService.deleteBudget(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting budget', error });
    }
};

export const getBudgetAlerts = async (req: Request, res: Response) => {
    try {
        const alerts = await budgetService.getBudgetAlerts(req.user!.id);
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving budget alerts', error });
    }
};