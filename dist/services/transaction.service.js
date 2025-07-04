"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionSummary = exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransactions = void 0;
const db_1 = require("../utils/db");
const getTransactions = async (page, limit, type, category) => {
    const db = await (0, db_1.connectToDatabase)();
    let query = `SELECT * FROM transactions WHERE 1=1`;
    const params = [];
    if (type) {
        query += ` AND type = ?`;
        params.push(type);
    }
    if (category) {
        query += ` AND category_id = ?`;
        params.push(category);
    }
    query += ` ORDER BY date DESC LIMIT ? OFFSET ?`;
    params.push(limit, (page - 1) * limit);
    return db.all(query, params);
};
exports.getTransactions = getTransactions;
const createTransaction = async (transactionData) => {
    const db = await (0, db_1.connectToDatabase)();
    const { id, userId, categoryId, amount, description, type, date, createdAt } = transactionData;
    await db.run(`INSERT INTO transactions (id, user_id, category_id, amount, description, type, date, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [id, userId, categoryId, amount, description, type, date, createdAt]);
    return transactionData;
};
exports.createTransaction = createTransaction;
const updateTransaction = async (id, updateData) => {
    const db = await (0, db_1.connectToDatabase)();
    const fields = Object.keys(updateData).map(key => `${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`).join(', ');
    const values = Object.values(updateData);
    await db.run(`UPDATE transactions SET ${fields} WHERE id = ?`, [...values, id]);
    return { id, ...updateData };
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (id) => {
    const db = await (0, db_1.connectToDatabase)();
    await db.run(`DELETE FROM transactions WHERE id = ?`, [id]);
    return { message: 'Transaction deleted successfully' };
};
exports.deleteTransaction = deleteTransaction;
const getTransactionSummary = async (userId, month) => {
    const db = await (0, db_1.connectToDatabase)();
    const start = `${month}-01`;
    const end = `${month}-31`;
    const summary = await db.all(`SELECT type, SUM(amount) as total
         FROM transactions
         WHERE user_id = ? AND date BETWEEN ? AND ?
         GROUP BY type`, [userId, start, end]);
    return summary;
};
exports.getTransactionSummary = getTransactionSummary;
