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
const budgetController = __importStar(require("../controllers/budget.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: Lấy danh sách ngân sách theo tháng
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: "2025-07"
 *     responses:
 *       200:
 *         description: Danh sách ngân sách
 */
router.get('/', auth_middleware_1.authMiddleware, budgetController.getBudgetsByMonth);
/**
 * @swagger
 * /api/budgets:
 *   post:
 *     summary: Tạo ngân sách mới
 *     tags: [Budget]
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
 *               month:
 *                 type: string
 *                 example: "2025-07"
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', auth_middleware_1.authMiddleware, budgetController.createBudget);
/**
 * @swagger
 * /api/budgets/{id}:
 *   put:
 *     summary: Cập nhật ngân sách
 *     tags: [Budget]
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
 *         description: Cập nhật thành công
 */
router.put('/:id', auth_middleware_1.authMiddleware, budgetController.updateBudget);
/**
 * @swagger
 * /api/budgets/{id}:
 *   delete:
 *     summary: Xóa ngân sách
 *     tags: [Budget]
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
router.delete('/:id', auth_middleware_1.authMiddleware, budgetController.deleteBudget);
/**
 * @swagger
 * /api/budgets/alerts:
 *   get:
 *     summary: Lấy cảnh báo ngân sách
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách cảnh báo ngân sách
 */
router.get('/alerts', auth_middleware_1.authMiddleware, budgetController.getBudgetAlerts);
exports.default = router;
