import { Request, Response } from 'express';
import * as reportService from '../services/report.service';

export const getMonthlyReport = async (req: Request, res: Response) => {
    try {
        const { year, month } = req.query;
        const report = await reportService.getMonthlyReport(
            req.user!.id,
            Number(year),
            Number(month)
        );
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving monthly report', error });
    }
};

export const getYearlyReport = async (req: Request, res: Response) => {
    try {
        const { year } = req.query;
        const report = await reportService.getYearlyReport(
            req.user!.id,
            Number(year)
        );
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving yearly report', error });
    }
};

export const getCategoryStatistics = async (req: Request, res: Response) => {
    try {
        const stats = await reportService.getCategoryStatistics(req.user!.id);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving category statistics', error });
    }
};