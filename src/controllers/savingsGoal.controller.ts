import { Request, Response } from 'express';
import * as savingsGoalService from '../services/savingsGoal.service';

// Using the extended Request type from our type declarations

// Get all savings goals
export const getSavingsGoals = async (req: Request, res: Response) => {
    try {
        const { limit, status = 'all' } = req.query;
        
        const goals = await savingsGoalService.getSavingsGoals(req.user!.id, {
            status: status as 'active' | 'completed' | 'all',
            limit: limit ? Number(limit) : undefined
        });
        
        res.status(200).json(goals);
    } catch (error: unknown) {
        console.error('Error getting savings goals:', error);
        const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
        res.status(500).json({ 
            message: 'Lỗi khi lấy danh sách mục tiêu tiết kiệm',
            error: errorMessage
        });
    }
};

// Create a new savings goal
export const createSavingsGoal = async (req: Request, res: Response) => {
    try {
        const newGoal = await savingsGoalService.createSavingsGoal(req.user!.id, req.body);
        res.status(201).json(newGoal);
    } catch (error) {
        res.status(500).json({ message: 'Error creating savings goal', error });
    }
};

// Update a savings goal
export const updateSavingsGoal = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedGoal = await savingsGoalService.updateSavingsGoal(id, req.body);
        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(500).json({ message: 'Error updating savings goal', error });
    }
};

// Delete a savings goal
export const deleteSavingsGoal = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await savingsGoalService.deleteSavingsGoal(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting savings goal', error });
    }
};

// Contribute to a savings goal
export const contributeToSavingsGoal = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount } = req.body;
    try {
        const result = await savingsGoalService.contributeToSavingsGoal(id, Number(amount));
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error contributing to savings goal', error });
    }
};

// Get progress of a savings goal
export const getSavingsGoalProgress = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const progress = await savingsGoalService.getSavingsGoalProgress(id);
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error getting savings goal progress', error });
    }
};

export const getMonthlySavingsSummary = async (req: Request, res: Response): Promise<void> => {
    const { month } = req.query;
    
    if (!month) {
        res.status(400).json({ 
            message: 'Month is a required parameter (YYYY-MM)' 
        });
        return;
    }

    try {
        const total = await savingsGoalService.getMonthlySavingsSummary(
            req.user!.id,
            month as string
        );
        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving monthly savings summary', 
            error 
        });
    }
};

export const getSavingsGoalsSummary = async (req: Request, res: Response): Promise<void> => {
    try {
        const summary = await savingsGoalService.getSavingsGoalsSummary(
            req.user!.id
        );
        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving savings goals summary', 
            error 
        });
    }
};

export const getActiveSavingsGoals = async (req: Request, res: Response): Promise<void> => {
    try {
        const { limit = 3 } = req.query;
        const goals = await savingsGoalService.getActiveSavingsGoals(
            req.user!.id,
            Number(limit)
        );
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving active savings goals', 
            error 
        });
    }
};

export const getMonthlySavings = async (req: Request, res: Response): Promise<void> => {
    const { month } = req.query;
    
    if (!month || typeof month !== 'string') {
        res.status(400).json({ 
            message: 'Month is a required parameter (YYYY-MM)' 
        });
        return;
    }

    try {
        const total = await savingsGoalService.getMonthlySavings(
            req.user!.id,
            month
        );
        res.status(200).json({ 
            totalSaved: total,
            month
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving monthly savings', 
            error 
        });
    }
};