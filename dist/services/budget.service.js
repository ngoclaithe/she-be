"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgetAlerts = exports.deleteBudget = exports.updateBudget = exports.getBudgetsByMonth = exports.createBudget = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../utils/db");
// Tạo ngân sách mới
const createBudget = async (userId, categoryId, amount, month // YYYY-MM
) => {
    const db = await (0, db_1.connectToDatabase)();
    const id = (0, uuid_1.v4)();
    const createdAt = new Date().toISOString();
    await db.run(`INSERT INTO budgets (id, user_id, category_id, amount, month, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`, [id, userId, categoryId, amount, month, createdAt]);
    return { id, user_id: userId, category_id: categoryId, amount, month, created_at: createdAt };
};
exports.createBudget = createBudget;
// Lấy danh sách ngân sách theo tháng
const getBudgetsByMonth = async (userId, month) => {
    const db = await (0, db_1.connectToDatabase)();
    return db.all(`SELECT * FROM budgets WHERE user_id = ? AND month = ? ORDER BY created_at DESC`, [userId, month]);
};
exports.getBudgetsByMonth = getBudgetsByMonth;
// Cập nhật ngân sách
const updateBudget = async (id, amount) => {
    const db = await (0, db_1.connectToDatabase)();
    await db.run(`UPDATE budgets SET amount = ? WHERE id = ?`, [amount, id]);
    return { id, amount };
};
exports.updateBudget = updateBudget;
// Xóa ngân sách
const deleteBudget = async (id) => {
    const db = await (0, db_1.connectToDatabase)();
    await db.run(`DELETE FROM budgets WHERE id = ?`, [id]);
    return { message: 'Budget deleted successfully' };
};
exports.deleteBudget = deleteBudget;
// Lấy cảnh báo ngân sách (ví dụ: chi tiêu vượt quá ngân sách)
const getBudgetAlerts = async (userId) => {
    const db = await (0, db_1.connectToDatabase)();
    // Ví dụ: lấy các ngân sách đã vượt quá số tiền cho phép
    return db.all(`SELECT b.*, 
            (SELECT SUM(amount) FROM transactions t WHERE t.user_id = b.user_id AND t.category_id = b.category_id AND strftime('%Y-%m', t.date) = strftime('%Y-%m', b.month)) as spent
         FROM budgets b
         WHERE b.user_id = ?`, [userId]);
};
exports.getBudgetAlerts = getBudgetAlerts;
