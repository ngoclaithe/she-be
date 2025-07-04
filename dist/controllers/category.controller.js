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
exports.getCategoryStatistics = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const categoryService = __importStar(require("../services/category.service"));
const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories(req.user.id);
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving categories', error });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const newCategory = await categoryService.createCategory(req.user.id, req.body);
        res.status(201).json(newCategory);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCategory = await categoryService.updateCategory(id, req.body);
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await categoryService.deleteCategory(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
};
exports.deleteCategory = deleteCategory;
const getCategoryStatistics = async (req, res) => {
    try {
        const stats = await categoryService.getCategoryStatistics(req.user.id);
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving category statistics', error });
    }
};
exports.getCategoryStatistics = getCategoryStatistics;
