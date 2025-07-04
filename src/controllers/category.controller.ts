import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getCategories(req.user!.id);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving categories', error });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const newCategory = await categoryService.createCategory(req.user!.id, req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedCategory = await categoryService.updateCategory(id, req.body);
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await categoryService.deleteCategory(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
};

export const getCategoryStatistics = async (req: Request, res: Response) => {
    try {
        const stats = await categoryService.getCategoryStatistics(req.user!.id);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving category statistics', error });
    }
};