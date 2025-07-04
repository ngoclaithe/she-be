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
exports.getSavingsGoalProgress = exports.contributeToSavingsGoal = exports.deleteSavingsGoal = exports.updateSavingsGoal = exports.createSavingsGoal = exports.getSavingsGoals = void 0;
const savingsGoalService = __importStar(require("../services/savingsGoal.service"));
// Get all savings goals
const getSavingsGoals = async (req, res) => {
    try {
        const goals = await savingsGoalService.getAllSavingsGoals(req.user.id);
        res.status(200).json(goals);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving savings goals', error });
    }
};
exports.getSavingsGoals = getSavingsGoals;
// Create a new savings goal
const createSavingsGoal = async (req, res) => {
    try {
        const newGoal = await savingsGoalService.createSavingsGoal(req.user.id, req.body);
        res.status(201).json(newGoal);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating savings goal', error });
    }
};
exports.createSavingsGoal = createSavingsGoal;
// Update a savings goal
const updateSavingsGoal = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedGoal = await savingsGoalService.updateSavingsGoal(id, req.body);
        res.status(200).json(updatedGoal);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating savings goal', error });
    }
};
exports.updateSavingsGoal = updateSavingsGoal;
// Delete a savings goal
const deleteSavingsGoal = async (req, res) => {
    const { id } = req.params;
    try {
        await savingsGoalService.deleteSavingsGoal(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting savings goal', error });
    }
};
exports.deleteSavingsGoal = deleteSavingsGoal;
// Contribute to a savings goal
const contributeToSavingsGoal = async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    try {
        const result = await savingsGoalService.contributeToSavingsGoal(id, Number(amount));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error contributing to savings goal', error });
    }
};
exports.contributeToSavingsGoal = contributeToSavingsGoal;
// Get progress of a savings goal
const getSavingsGoalProgress = async (req, res) => {
    const { id } = req.params;
    try {
        const progress = await savingsGoalService.getSavingsGoalProgress(id);
        res.status(200).json(progress);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving savings goal progress', error });
    }
};
exports.getSavingsGoalProgress = getSavingsGoalProgress;
