"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryStatistics = exports.getYearlyReport = exports.getMonthlyReport = void 0;
const db_1 = require("../utils/db");
// Báo cáo tháng
const getMonthlyReport = async (userId, year, month) => {
    const db = await (0, db_1.connectToDatabase)();
    const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
    const transactions = await db.all(`SELECT * FROM transactions WHERE user_id = ? AND strftime('%Y-%m', date) = ?`, [userId, monthStr]);
    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
    };
};
exports.getMonthlyReport = getMonthlyReport;
// Báo cáo năm
const getYearlyReport = async (userId, year) => {
    const db = await (0, db_1.connectToDatabase)();
    const reports = [];
    for (let month = 1; month <= 12; month++) {
        const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
        const transactions = await db.all(`SELECT * FROM transactions WHERE user_id = ? AND strftime('%Y-%m', date) = ?`, [userId, monthStr]);
        const totalIncome = transactions
            .filter((t) => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);
        const totalExpense = transactions
            .filter((t) => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);
        reports.push({
            month,
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
        });
    }
    return reports;
};
exports.getYearlyReport = getYearlyReport;
// Thống kê theo category
const getCategoryStatistics = async (userId) => {
    const db = await (0, db_1.connectToDatabase)();
    return db.all(`SELECT c.name as category, 
                SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as totalIncome,
                SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as totalExpense
         FROM categories c
         LEFT JOIN transactions t ON c.id = t.category_id
         WHERE c.user_id = ?
         GROUP BY c.id, c.name
         ORDER BY c.name`, [userId]);
};
exports.getCategoryStatistics = getCategoryStatistics;
