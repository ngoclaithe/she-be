import { Request, Response } from 'express';
import * as reportService from '../services/report.service';

export const getMonthlyReport = async (req: Request, res: Response) => {
    try {
        const year = req.query.year ? Number(req.query.year) : undefined;
        const month = req.query.month ? Number(req.query.month) : undefined;
        
        console.log(`[API] Getting monthly report for user ${req.user!.id}, year: ${year}, month: ${month}`);
        
        const report = await reportService.getMonthlyReport(
            req.user!.id,
            year,
            month
        );
        
        res.status(200).json(report);
    } catch (error) {
        console.error('Error in getMonthlyReport:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error retrieving monthly report',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
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