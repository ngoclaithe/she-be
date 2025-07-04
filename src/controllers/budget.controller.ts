import { Request, Response } from 'express';
import * as budgetService from '../services/budget.service';

// Lấy danh sách ngân sách theo tháng
export const getBudgetsByMonth = async (req: Request, res: Response) => {
    console.log(`[${new Date().toISOString()}] [GET /api/budgets] User: ${req.user!.id}`);
    try {
        const { month } = req.query;
        if (!month) {
            console.log('Month parameter is required');
            return res.status(400).json({ 
                success: false,
                message: 'Month parameter is required (YYYY-MM)' 
            });
        }
        
        console.log(`Fetching budgets for month: ${month}`);
        const budgets = await budgetService.getBudgetsByMonth(req.user!.id, month as string);
        
        console.log(`Found ${budgets.length} budgets`);
        res.status(200).json({
            success: true,
            data: budgets
        });
    } catch (error) {
        console.error('Error in getBudgetsByMonth:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error while retrieving budgets',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Tạo ngân sách mới
export const createBudget = async (req: Request, res: Response) => {
    console.log(`[${new Date().toISOString()}] [POST /api/budgets] User: ${req.user!.id}`, req.body);
    
    try {
        const { categoryId, amount, month } = req.body;
        
        // Validate input
        if (!categoryId || amount === undefined || !month) {
            const missingFields = [];
            if (!categoryId) missingFields.push('categoryId');
            if (amount === undefined) missingFields.push('amount');
            if (!month) missingFields.push('month');
            
            console.log('Missing required fields:', missingFields);
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        
        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            console.log('Invalid amount:', amount);
            return res.status(400).json({
                success: false,
                message: 'Amount must be a positive number'
            });
        }
        
        console.log(`Creating budget for category ${categoryId}, amount: ${amount}, month: ${month}`);
        const newBudget = await budgetService.createBudget(
            req.user!.id, 
            categoryId, 
            Number(amount), 
            month
        );
        
        console.log('Budget created successfully:', newBudget.id);
        res.status(201).json({
            success: true,
            data: newBudget
        });
    } catch (error) {
        console.error('Error in createBudget:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create budget',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Cập nhật ngân sách
export const updateBudget = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount } = req.body;
    
    console.log(`[${new Date().toISOString()}] [PUT /api/budgets/${id}] User: ${req.user!.id}`, { amount });
    
    try {
        if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0) {
            console.log('Invalid amount:', amount);
            return res.status(400).json({
                success: false,
                message: 'A valid positive amount is required'
            });
        }
        
        console.log(`Updating budget ${id} with amount: ${amount}`);
        const updatedBudget = await budgetService.updateBudget(id, Number(amount));
        
        console.log(`Budget ${id} updated successfully`);
        res.status(200).json({
            success: true,
            data: updatedBudget
        });
    } catch (error) {
        console.error(`Error updating budget ${id}:`, error);
        res.status(500).json({
            success: false,
            message: 'Failed to update budget',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Xóa ngân sách
export const deleteBudget = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    console.log(`[${new Date().toISOString()}] [DELETE /api/budgets/${id}] User: ${req.user!.id}`);
    
    try {
        console.log(`Deleting budget ${id}`);
        await budgetService.deleteBudget(id);
        
        console.log(`Budget ${id} deleted successfully`);
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting budget ${id}:`, error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete budget',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Lấy cảnh báo ngân sách
export const getBudgetAlerts = async (req: Request, res: Response) => {
    console.log(`[${new Date().toISOString()}] [GET /api/budgets/alerts] User: ${req.user!.id}`);
    
    try {
        console.log('Fetching budget alerts...');
        const alerts = await budgetService.getBudgetAlerts(req.user!.id);
        
        console.log(`Found ${alerts.length} budget alerts`);
        res.status(200).json({
            success: true,
            data: alerts
        });
    } catch (error) {
        console.error('Error in getBudgetAlerts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve budget alerts',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};