"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSavingsGoalProgress = exports.contributeToSavingsGoal = exports.deleteSavingsGoal = exports.updateSavingsGoal = exports.getAllSavingsGoals = exports.createSavingsGoal = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../utils/db");
// Tạo mục tiêu tiết kiệm mới
const createSavingsGoal = async (userId, data) => {
    const db = await (0, db_1.connectToDatabase)();
    const id = (0, uuid_1.v4)();
    await db.run(`INSERT INTO savings_goals (id, user_id, name, target_amount, current_amount, target_date, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        id,
        userId,
        data.name,
        data.targetAmount,
        data.currentAmount || 0,
        data.targetDate,
        new Date().toISOString()
    ]);
    return { ...data, id, userId };
};
exports.createSavingsGoal = createSavingsGoal;
// Lấy danh sách mục tiêu tiết kiệm của user
const getAllSavingsGoals = async (userId) => {
    const db = await (0, db_1.connectToDatabase)();
    return db.all(`SELECT * FROM savings_goals WHERE user_id = ? ORDER BY created_at DESC`, [userId]);
};
exports.getAllSavingsGoals = getAllSavingsGoals;
// Cập nhật mục tiêu tiết kiệm
const updateSavingsGoal = async (id, data) => {
    const db = await (0, db_1.connectToDatabase)();
    const fields = Object.keys(data).map(key => `${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`).join(', ');
    const values = Object.values(data);
    await db.run(`UPDATE savings_goals SET ${fields} WHERE id = ?`, [...values, id]);
    return { id, ...data };
};
exports.updateSavingsGoal = updateSavingsGoal;
// Xóa mục tiêu tiết kiệm
const deleteSavingsGoal = async (id) => {
    const db = await (0, db_1.connectToDatabase)();
    await db.run(`DELETE FROM savings_goals WHERE id = ?`, [id]);
    return { message: 'Savings goal deleted successfully' };
};
exports.deleteSavingsGoal = deleteSavingsGoal;
// Đóng góp vào mục tiêu tiết kiệm
const contributeToSavingsGoal = async (id, amount) => {
    const db = await (0, db_1.connectToDatabase)();
    await db.run(`UPDATE savings_goals SET current_amount = current_amount + ? WHERE id = ?`, [amount, id]);
    return { id, contributed: amount };
};
exports.contributeToSavingsGoal = contributeToSavingsGoal;
// Lấy tiến độ mục tiêu tiết kiệm
const getSavingsGoalProgress = async (id) => {
    const db = await (0, db_1.connectToDatabase)();
    return db.get(`SELECT id, name, target_amount, current_amount, target_date, created_at FROM savings_goals WHERE id = ?`, [id]);
};
exports.getSavingsGoalProgress = getSavingsGoalProgress;
