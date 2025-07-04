"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryStatistics = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../utils/db");
const getCategories = async (userId) => {
    const db = await (0, db_1.connectToDatabase)();
    return db.all(`SELECT * FROM categories WHERE user_id = ? ORDER BY created_at DESC`, [userId]);
};
exports.getCategories = getCategories;
const createCategory = async (userId, data) => {
    const db = await (0, db_1.connectToDatabase)();
    const id = (0, uuid_1.v4)();
    await db.run(`INSERT INTO categories (id, user_id, name, icon, color, type, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        id,
        userId,
        data.name,
        data.icon || null,
        data.color || null,
        data.type,
        new Date().toISOString()
    ]);
    return { ...data, id, userId };
};
exports.createCategory = createCategory;
const updateCategory = async (id, data) => {
    const db = await (0, db_1.connectToDatabase)();
    const fields = Object.keys(data).map(key => `${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`).join(', ');
    const values = Object.values(data);
    await db.run(`UPDATE categories SET ${fields} WHERE id = ?`, [...values, id]);
    return { id, ...data };
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    const db = await (0, db_1.connectToDatabase)();
    await db.run(`DELETE FROM categories WHERE id = ?`, [id]);
    return { message: 'Category deleted successfully' };
};
exports.deleteCategory = deleteCategory;
const getCategoryStatistics = async (userId) => {
    const db = await (0, db_1.connectToDatabase)();
    return db.all(`SELECT c.id, c.name, c.type,
            SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as totalIncome,
            SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as totalExpense
         FROM categories c
         LEFT JOIN transactions t ON c.id = t.category_id
         WHERE c.user_id = ?
         GROUP BY c.id, c.name, c.type
         ORDER BY c.name`, [userId]);
};
exports.getCategoryStatistics = getCategoryStatistics;
