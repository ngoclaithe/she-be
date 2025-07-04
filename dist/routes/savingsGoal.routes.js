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
const savingsGoalController = __importStar(require("../controllers/savingsGoal.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
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
router.get('/', auth_middleware_1.authMiddleware, savingsGoalController.getSavingsGoals);
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
router.post('/', auth_middleware_1.authMiddleware, savingsGoalController.createSavingsGoal);
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
router.put('/:id', auth_middleware_1.authMiddleware, savingsGoalController.updateSavingsGoal);
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
router.delete('/:id', auth_middleware_1.authMiddleware, savingsGoalController.deleteSavingsGoal);
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
router.post('/:id/contribute', auth_middleware_1.authMiddleware, savingsGoalController.contributeToSavingsGoal);
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
router.get('/:id/progress', auth_middleware_1.authMiddleware, savingsGoalController.getSavingsGoalProgress);
exports.default = router;
