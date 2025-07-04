import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '../utils/db';

export const getCategories = async (userId: string) => {
    const db = await connectToDatabase();
    return db.all(
        `SELECT * FROM categories WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
    );
};

export const createCategory = async (userId: string, data: any) => {
    const db = await connectToDatabase();
    const id = uuidv4();
    await db.run(
        `INSERT INTO categories (id, user_id, name, icon, color, type, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            userId,
            data.name,
            data.icon || null,
            data.color || null,
            data.type,
            new Date().toISOString()
        ]
    );
    return { ...data, id, userId };
};

export const updateCategory = async (id: string, data: any) => {
    const db = await connectToDatabase();
    const fields = Object.keys(data).map(key =>
        `${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`
    ).join(', ');
    const values = Object.values(data);
    await db.run(
        `UPDATE categories SET ${fields} WHERE id = ?`,
        [...values, id]
    );
    return { id, ...data };
};

export const deleteCategory = async (id: string) => {
    const db = await connectToDatabase();
    await db.run(`DELETE FROM categories WHERE id = ?`, [id]);
    return { message: 'Category deleted successfully' };
};

export const getCategoryStatistics = async (userId: string) => {
    const db = await connectToDatabase();
    return db.all(
        `SELECT c.id, c.name, c.type,
            SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as totalIncome,
            SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as totalExpense
         FROM categories c
         LEFT JOIN transactions t ON c.id = t.category_id
         WHERE c.user_id = ?
         GROUP BY c.id, c.name, c.type
         ORDER BY c.name`,
        [userId]
    );
};