import express, { Router, Request, Response, NextFunction } from 'express';
import * as savingsGoalController from '../controllers/savingsGoal.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

// Import the extended Request type from our type declarations
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
 *                 totalSaved:
 *                   type: number
 *                   description: Tổng số tiền đã tiết kiệm trong tháng
 *                 month:
 *                   type: string
 *                   description: Tháng được truy vấn (YYYY-MM)
 */
router.get('/savings/summary', authMiddleware, savingsGoalController.getMonthlySavings);

/**
 * @swagger
 * /api/savings-goals:
 *   get:
 *     summary: Lấy danh sách mục tiêu tiết kiệm
 *     description: Lấy danh sách các mục tiêu tiết kiệm với bộ lọc
 *     tags: [SavingsGoal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 3
 *           minimum: 1
 *           maximum: 50
 *         description: Số lượng mục tiêu tối đa cần lấy (từ 1 đến 50)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, all]
 *           default: "active"
 *         description: Trạng thái mục tiêu (active - đang thực hiện, completed - đã hoàn thành, all - tất cả)
 *     responses:
 *       200:
 *         description: Danh sách mục tiêu tiết kiệm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavingsGoal'
 */
router.get('/', authMiddleware, savingsGoalController.getSavingsGoals);

/**
 * @swagger
 * /api/savings-goals:
 *   post:
 *     summary: Tạo mục tiêu tiết kiệm mới
 *     tags: [SavingsGoal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               targetAmount:
 *                 type: number
 *               currentAmount:
 *                 type: number
 *               targetDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', authMiddleware, savingsGoalController.createSavingsGoal);

/**
 * @swagger
 * /api/savings-goals/{id}:
 *   put:
 *     summary: Cập nhật mục tiêu tiết kiệm
 *     tags: [SavingsGoal]
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
router.put('/:id', authMiddleware, savingsGoalController.updateSavingsGoal);

/**
 * @swagger
 * /api/savings-goals/{id}:
 *   delete:
 *     summary: Xóa mục tiêu tiết kiệm
 *     tags: [SavingsGoal]
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
router.delete('/:id', authMiddleware, savingsGoalController.deleteSavingsGoal);

/**
 * @swagger
 * /api/savings-goals/{id}/contribute:
 *   post:
 *     summary: Đóng góp vào mục tiêu tiết kiệm
 *     tags: [SavingsGoal]
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
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Đóng góp thành công
 */
router.post('/:id/contribute', authMiddleware, savingsGoalController.contributeToSavingsGoal);

/**
 * @swagger
 * /api/savings-goals/{id}/progress:
 *   get:
 *     summary: Lấy tiến độ mục tiêu tiết kiệm
 *     tags: [SavingsGoal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tiến độ mục tiêu tiết kiệm
 */
router.get('/:id/progress', authMiddleware, savingsGoalController.getSavingsGoalProgress);

/**
 * @swagger
 * /api/savings-goals/summary:
 *   get:
 *     summary: Lấy tổng quan các mục tiêu tiết kiệm
 *     description: Lấy tổng quan về tất cả các mục tiêu tiết kiệm
 *     tags: [SavingsGoal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalGoals:
 *                   type: integer
 *                   description: Tổng số mục tiêu
 *                 completedGoals:
 *                   type: integer
 *                   description: Số mục tiêu đã hoàn thành
 *                 inProgressGoals:
 *                   type: integer
 *                   description: Số mục tiêu đang thực hiện
 *                 totalSaved:
 *                   type: number
 *                   description: Tổng số tiền đã tiết kiệm
 *                 totalTarget:
 *                   type: number
 *                   description: Tổng mục tiêu tiết kiệm
 *                 progressPercentage:
 *                   type: number
 *                   description: Phần trăm hoàn thành trung bình
 *                 nearestDeadlineGoal:
 *                   $ref: '#/components/schemas/SavingsGoal'
 *                   description: Mục tiêu có thời hạn gần nhất
 */
router.get('/summary', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
    savingsGoalController.getSavingsGoalsSummary(req, res).catch(next);
});

// Error handling middleware for savings goal routes
const savingsGoalErrorHandler = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction): void => {
    console.error('Error in savings goal routes:', err);
    
    if (!res.headersSent) {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ 
            success: false,
            message: 'Internal server error in savings goal routes',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
    
    // Pass to the global error handler
    next(err);
};

// Apply error handling middleware
router.use(savingsGoalErrorHandler as express.ErrorRequestHandler);

export default router;