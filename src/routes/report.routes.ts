import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/reports/monthly:
 *   get:
 *     summary: Báo cáo tháng
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Báo cáo tháng
 */
router.get('/monthly', authMiddleware, reportController.getMonthlyReport);

/**
 * @swagger
 * /api/reports/yearly:
 *   get:
 *     summary: Báo cáo năm
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Báo cáo năm
 */
router.get('/yearly', authMiddleware, reportController.getYearlyReport);

/**
 * @swagger
 * /api/reports/categories:
 *   get:
 *     summary: Thống kê theo category
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê theo category
 */
router.get('/categories', authMiddleware, reportController.getCategoryStatistics);

export default router;