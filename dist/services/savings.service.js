"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlySavings = void 0;
const db_1 = require("../utils/db");
const getMonthlySavings = async (userId, month) => {
    const db = await (0, db_1.connectToDatabase)();
    // Lấy tổng số tiền tiết kiệm trong tháng
    const result = await db.get(`SELECT COALESCE(SUM(amount), 0) as total
         FROM transactions 
         WHERE user_id = ? 
         AND type = 'savings' 
         AND strftime('%Y-%m', date) = ?`, [userId, month]);
    return result?.total || 0;
};
exports.getMonthlySavings = getMonthlySavings;
