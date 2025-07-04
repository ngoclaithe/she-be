import { Request, Response, NextFunction } from 'express';
import * as savingsService from '../services/savings.service';
export const getMonthlySavings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { month } = req.query;
    
    if (!month || typeof month !== 'string') {
        res.status(400).json({ 
            success: false,
            message: 'Month is a required parameter (YYYY-MM)' 
        });
        return;
    }

    try {
        const total = await savingsService.getMonthlySavings(
            req.user!.id,
            month
        );
        
        res.status(200).json({ 
            success: true,
            data: {
                totalSaved: total,
                month
            }
        });
    } catch (error) {
        console.error('Error in getMonthlySavings:', error);
        next(error);
    }
};
