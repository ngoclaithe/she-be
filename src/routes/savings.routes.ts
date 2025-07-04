import express, { Router, Request, Response, NextFunction } from 'express';
import * as savingsController from '../controllers/savings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

// Using the extended Request type from our type declarations
import {} from '../types/express';

// Type for error handling middleware
type ErrorWithStatus = Error & { statusCode?: number };

const router = Router();

/**
 * @swagger
 * /api/savings:
 *   get:
 *     summary: Lấy tổng quan tiết kiệm trong tháng
 *     description: Lấy tổng số tiền đã tiết kiệm trong tháng
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           format: YYYY-MM
 *           example: "2025-07"
 *         description: Tháng cần xem báo cáo (định dạng YYYY-MM)
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSaved:
 *                       type: number
 *                       description: Tổng số tiền đã tiết kiệm trong tháng
 *                     month:
 *                       type: string
 *                       description: Tháng được truy vấn (YYYY-MM)
 */
router.get('/', authMiddleware, savingsController.getMonthlySavings);

// Error handling middleware
const savingsErrorHandler = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction): void => {
    console.error('Error in savings routes:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

// Apply error handling middleware
router.use(savingsErrorHandler as express.ErrorRequestHandler);

export default router;
