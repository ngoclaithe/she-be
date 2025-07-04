import express, { Router, Request, Response, NextFunction } from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

// Import the extended Request type from our type declarations
import {} from '../types/express';

// Type for error handling middleware
type ErrorWithStatus = Error & { statusCode?: number };

const router = Router();

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Lấy danh sách giao dịch
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách giao dịch
 */
router.get('/', authMiddleware, transactionController.getTransactions);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Tạo giao dịch mới
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', authMiddleware, transactionController.createTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Cập nhật giao dịch
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authMiddleware, transactionController.updateTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Xóa giao dịch
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Xóa thành công
 */
router.delete('/:id', authMiddleware, transactionController.deleteTransaction);

/**
 * @swagger
 * /api/transactions/summary:
 *   get:
 *     summary: Lấy tổng thu nhập hoặc chi tiêu theo tháng
 *     tags: [Transaction]
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
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *           example: "income"
 *         description: Loại giao dịch (income - thu nhập, expense - chi tiêu)
 *     responses:
 *       200:
 *         description: Tổng thu nhập hoặc chi tiêu trong tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   description: Tổng số tiền
 *                 month:
 *                   type: string
 *                   description: Tháng được truy vấn (YYYY-MM)
 *                 type:
 *                   type: string
 *                   description: Loại giao dịch (income/expense)
 */
router.get('/summary', authMiddleware, transactionController.getTransactionSummary);

/**
 * @swagger
 * /api/transactions/recent:
 *   get:
 *     summary: Lấy các giao dịch gần đây
 *     description: Lấy danh sách các giao dịch gần đây nhất
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *           minimum: 1
 *           maximum: 50
 *         description: Số lượng giao dịch tối đa cần lấy (từ 1 đến 50)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: "-date"
 *           enum: ["date", "-date", "amount", "-amount"]
 *         description: Sắp xếp theo trường (date, -date, amount, -amount)
 *     responses:
 *       200:
 *         description: Danh sách giao dịch gần đây
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get('/recent', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
    transactionController.getRecentTransactions(req, res).catch(next);
});

// Error handling middleware for transaction routes
const transactionErrorHandler = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction): void => {
    console.error('Error in transaction routes:', err);
    
    if (!res.headersSent) {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ 
            success: false,
            message: 'Internal server error in transaction routes',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
    
    // Pass to the global error handler
    next(err);
};

// Apply error handling middleware
router.use(transactionErrorHandler as express.ErrorRequestHandler);

export default router;