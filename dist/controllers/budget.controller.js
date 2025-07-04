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
exports.getBudgetAlerts = exports.deleteBudget = exports.updateBudget = exports.createBudget = exports.getBudgetsByMonth = void 0;
const budgetService = __importStar(require("../services/budget.service"));
const getBudgetsByMonth = async (req, res) => {
    try {
        const { month } = req.query;
        const budgets = await budgetService.getBudgetsByMonth(req.user.id, month);
        res.status(200).json(budgets);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving budgets', error });
    }
};
exports.getBudgetsByMonth = getBudgetsByMonth;
const createBudget = async (req, res) => {
    try {
        const { categoryId, amount, month } = req.body;
        const newBudget = await budgetService.createBudget(req.user.id, categoryId, Number(amount), month);
        res.status(201).json(newBudget);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating budget', error });
    }
};
exports.createBudget = createBudget;
const updateBudget = async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    try {
        const updatedBudget = await budgetService.updateBudget(id, Number(amount));
        res.status(200).json(updatedBudget);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating budget', error });
    }
};
exports.updateBudget = updateBudget;
const deleteBudget = async (req, res) => {
    const { id } = req.params;
    try {
        await budgetService.deleteBudget(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting budget', error });
    }
};
exports.deleteBudget = deleteBudget;
const getBudgetAlerts = async (req, res) => {
    try {
        const alerts = await budgetService.getBudgetAlerts(req.user.id);
        res.status(200).json(alerts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving budget alerts', error });
    }
};
exports.getBudgetAlerts = getBudgetAlerts;
