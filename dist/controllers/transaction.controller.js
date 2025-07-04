"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentTransactions = exports.getMonthlyTransactionSummary = exports.getTransactionSummary = exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransactions = void 0;
const transactionService = __importStar(require("../services/transaction.service"));
// Using the extended Request type from our type declarations
// Get all transactions with pagination and filtering
const getTransactions = async (req, res) => {
    const { page = '1', limit = '10', type, category } = req.query;
    try {
        const transactions = await transactionService.getTransactions(Number(page), Number(limit), type, category);
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving transactions', error });
    }
};
exports.getTransactions = getTransactions;
// Create a new transaction
const createTransaction = async (req, res) => {
    const transactionData = req.body;
    try {
        const newTransaction = await transactionService.createTransaction(transactionData);
        res.status(201).json(newTransaction);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating transaction', error });
    }
};
exports.createTransaction = createTransaction;
// Update an existing transaction
const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const transactionData = req.body;
    try {
        const updatedTransaction = await transactionService.updateTransaction(id, transactionData);
        res.status(200).json(updatedTransaction);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating transaction', error });
    }
};
exports.updateTransaction = updateTransaction;
// Delete a transaction
const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        await transactionService.deleteTransaction(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting transaction', error });
    }
};
exports.deleteTransaction = deleteTransaction;
// Get transaction summary for a specific month
const getTransactionSummary = async (req, res) => {
    const { month } = req.query;
    try {
        const summary = await transactionService.getTransactionSummary(req.user.id, month);
        res.status(200).json(summary);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving transaction summary', error });
    }
};
exports.getTransactionSummary = getTransactionSummary;
const getMonthlyTransactionSummary = async (req, res) => {
    const { month, type } = req.query;
    if (!month || !type || (type !== 'income' && type !== 'expense')) {
        res.status(400).json({
            success: false,
            message: 'Thiếu tham số bắt buộc: month (YYYY-MM) và type (income/expense)'
        });
        return;
    }
    try {
        const total = await transactionService.getMonthlyTransactionSummary(req.user.id, month, type);
        res.status(200).json({
            success: true,
            data: {
                total,
                month,
                type
            }
        });
    }
    catch (error) {
        console.error('Error getting monthly transaction summary:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy tổng quan giao dịch',
            error: error instanceof Error ? error.message : 'Lỗi không xác định'
        });
    }
};
exports.getMonthlyTransactionSummary = getMonthlyTransactionSummary;
const getRecentTransactions = async (req, res) => {
    const { limit = '5' } = req.query;
    const limitNumber = Math.min(parseInt(limit, 10) || 5, 50);
    try {
        const transactions = await transactionService.getRecentTransactions(req.user.id, limitNumber);
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error retrieving recent transactions',
            error
        });
    }
};
exports.getRecentTransactions = getRecentTransactions;
