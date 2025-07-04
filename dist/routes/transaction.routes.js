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
const express_1 = require("express");
const transactionController = __importStar(require("../controllers/transaction.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
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
router.get('/', auth_middleware_1.authMiddleware, transactionController.getTransactions);
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
router.post('/', auth_middleware_1.authMiddleware, transactionController.createTransaction);
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
router.put('/:id', auth_middleware_1.authMiddleware, transactionController.updateTransaction);
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
router.delete('/:id', auth_middleware_1.authMiddleware, transactionController.deleteTransaction);
/**
 * @swagger
 * /api/transactions/summary:
 *   get:
 *     summary: Lấy tổng quan giao dịch theo tháng và loại
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
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *     responses:
 *       200:
 *         description: Tổng quan giao dịch
 */
router.get('/summary', auth_middleware_1.authMiddleware, transactionController.getMonthlyTransactionSummary);
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
router.get('/recent', auth_middleware_1.authMiddleware, (req, res, next) => {
    transactionController.getRecentTransactions(req, res).catch(next);
});
// Error handling middleware for transaction routes
const transactionErrorHandler = (err, req, res, next) => {
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
router.use(transactionErrorHandler);
exports.default = router;
