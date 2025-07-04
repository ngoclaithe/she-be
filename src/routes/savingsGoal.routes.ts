import { Router } from 'express';
import * as savingsGoalController from '../controllers/savingsGoal.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/savings-goals:
 *   get:
 *     summary: Lấy danh sách mục tiêu tiết kiệm
 *     tags: [SavingsGoal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách mục tiêu tiết kiệm
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

export default router;