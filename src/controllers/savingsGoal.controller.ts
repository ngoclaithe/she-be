import { Request, Response } from 'express';
import * as savingsGoalService from '../services/savingsGoal.service';

// Get all savings goals
export const getSavingsGoals = async (req: Request, res: Response) => {
    try {
        const goals = await savingsGoalService.getAllSavingsGoals(req.user!.id);
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving savings goals', error });
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
        res.status(500).json({ message: 'Error retrieving savings goal progress', error });
    }
};