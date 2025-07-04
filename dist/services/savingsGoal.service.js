"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlySavings = exports.getActiveSavingsGoals = exports.getSavingsGoalsSummary = exports.getSavingsGoals = exports.getMonthlySavingsSummary = exports.getSavingsGoalProgress = exports.contributeToSavingsGoal = exports.deleteSavingsGoal = exports.updateSavingsGoal = exports.getAllSavingsGoals = exports.createSavingsGoal = void 0;
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
    return db.get('SELECT current_amount, target_amount FROM savings_goals WHERE id = ?', [id]);
};
exports.getSavingsGoalProgress = getSavingsGoalProgress;
const getMonthlySavingsSummary = async (userId, month) => {
    const db = await (0, db_1.connectToDatabase)();
    const result = await db.get(`SELECT COALESCE(SUM(amount), 0) as total
         FROM transactions 
         WHERE user_id = ? 
         AND type = 'savings' 
         AND strftime('%Y-%m', date) = ?`, [userId, month]);
    return result?.total || 0;
};
exports.getMonthlySavingsSummary = getMonthlySavingsSummary;
const getSavingsGoals = async (userId, options = {}) => {
    const { status = 'all', limit } = options;
    const db = await (0, db_1.connectToDatabase)();
    let query = `SELECT * FROM savings_goals WHERE user_id = ?`;
    const params = [userId];
    if (status === 'active') {
        query += ` AND current_amount < target_amount`;
    }
    else if (status === 'completed') {
        query += ` AND current_amount >= target_amount`;
    }
    query += ` ORDER BY created_at DESC`;
    if (limit) {
        query += ` LIMIT ?`;
        params.push(limit);
    }
    return db.all(query, params);
};
exports.getSavingsGoals = getSavingsGoals;
const getSavingsGoalsSummary = async (userId) => {
    const db = await (0, db_1.connectToDatabase)();
    const result = await db.get(`SELECT 
            COUNT(*) as totalGoals,
            SUM(target_amount) as totalTarget,
            SUM(current_amount) as totalSaved,
            SUM(CASE WHEN current_amount >= target_amount THEN 1 ELSE 0 END) as completedGoals
         FROM savings_goals 
         WHERE user_id = ?`, [userId]);
    return {
        totalGoals: result?.totalGoals || 0,
        totalTarget: result?.totalTarget || 0,
        totalSaved: result?.totalSaved || 0,
        completedGoals: result?.completedGoals || 0
    };
};
exports.getSavingsGoalsSummary = getSavingsGoalsSummary;
const getActiveSavingsGoals = async (userId, limit = 3) => {
    const db = await (0, db_1.connectToDatabase)();
    return db.all(`SELECT * FROM savings_goals 
         WHERE user_id = ? AND current_amount < target_amount
         ORDER BY target_date ASC
         LIMIT ?`, [userId, limit]);
};
exports.getActiveSavingsGoals = getActiveSavingsGoals;
const getMonthlySavings = async (userId, month) => {
    const db = await (0, db_1.connectToDatabase)();
    const result = await db.get(`SELECT COALESCE(SUM(amount), 0) as total
         FROM transactions 
         WHERE user_id = ? 
         AND type = 'savings' 
         AND strftime('%Y-%m', date) = ?`, [userId, month]);
    return result?.total || 0;
};
exports.getMonthlySavings = getMonthlySavings;
