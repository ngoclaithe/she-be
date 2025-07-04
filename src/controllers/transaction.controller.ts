import { Request, Response } from 'express';
import * as transactionService from '../services/transaction.service';

// Using the extended Request type from our type declarations

// Get all transactions with pagination and filtering
export const getTransactions = async (req: Request, res: Response) => {
    const { page = '1', limit = '10', type, category } = req.query;
    try {
        const transactions = await transactionService.getTransactions(
            Number(page),
            Number(limit),
            type as string,
            category as string
        );
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving transactions', error });
    }
};

// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
    const transactionData = req.body;
    try {
        const newTransaction = await transactionService.createTransaction(transactionData);
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Error creating transaction', error });
    }
};

// Update an existing transaction
export const updateTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transactionData = req.body;
    try {
        const updatedTransaction = await transactionService.updateTransaction(id, transactionData);
        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Error updating transaction', error });
    }
};

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await transactionService.deleteTransaction(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction', error });
    }
};

// Get transaction summary for a specific month
export const getTransactionSummary = async (req: Request, res: Response) => {
    const { month } = req.query;
    try {
        const summary = await transactionService.getTransactionSummary(req.user!.id, month as string);
        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving transaction summary', error });
    }
};
export const getMonthlyTransactionSummary = async (req: Request, res: Response): Promise<void> => {
    const { month, type } = req.query;
    
    if (!month || !type || (type !== 'income' && type !== 'expense')) {
        res.status(400).json({ 
            success: false,
            message: 'Thiếu tham số bắt buộc: month (YYYY-MM) và type (income/expense)' 
        });
        return;
    }

    try {
        const total = await transactionService.getMonthlyTransactionSummary(
            req.user!.id,
            month as string,
            type as 'income' | 'expense'
        );
        
        res.status(200).json({ 
            success: true,
            data: {
                total,
                month,
                type
            }
        });
    } catch (error) {
        console.error('Error getting monthly transaction summary:', error);
        res.status(500).json({ 
            success: false,
            message: 'Lỗi khi lấy tổng quan giao dịch',
            error: error instanceof Error ? error.message : 'Lỗi không xác định'
        });
    }
};

export const getRecentTransactions = async (req: Request, res: Response): Promise<void> => {
    const { limit = '5' } = req.query;
    const limitNumber = Math.min(parseInt(limit as string, 10) || 5, 50);
    
    try {
        const transactions = await transactionService.getRecentTransactions(
            req.user!.id,
            limitNumber
        );
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving recent transactions', 
            error 
        });
    }
};