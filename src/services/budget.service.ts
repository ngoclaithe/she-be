import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '../utils/db';

// Tạo ngân sách mới
export const createBudget = async (
    userId: string,
    categoryId: string,
    amount: number,
    month: string // YYYY-MM
) => {
    const db = await connectToDatabase();
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    await db.run(
        `INSERT INTO budgets (id, user_id, category_id, amount, month, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, userId, categoryId, amount, month, createdAt]
    );
    return { id, user_id: userId, category_id: categoryId, amount, month, created_at: createdAt };
};

// Lấy danh sách ngân sách theo tháng
export const getBudgetsByMonth = async (userId: string, month: string) => {
    const db = await connectToDatabase();
    return db.all(
        `SELECT * FROM budgets WHERE user_id = ? AND month = ? ORDER BY created_at DESC`,
        [userId, month]
    );
};

// Cập nhật ngân sách
export const updateBudget = async (id: string, amount: number) => {
    const db = await connectToDatabase();
    await db.run(
        `UPDATE budgets SET amount = ? WHERE id = ?`,
        [amount, id]
    );
    return { id, amount };
};

// Xóa ngân sách
export const deleteBudget = async (id: string) => {
    const db = await connectToDatabase();
    await db.run(
        `DELETE FROM budgets WHERE id = ?`,
        [id]
    );
    return { message: 'Budget deleted successfully' };
};

// Lấy cảnh báo ngân sách (ví dụ: chi tiêu vượt quá ngân sách)
export const getBudgetAlerts = async (userId: string) => {
    const db = await connectToDatabase();
    // Ví dụ: lấy các ngân sách đã vượt quá số tiền cho phép
    return db.all(
        `SELECT b.*, 
            (SELECT SUM(amount) FROM transactions t WHERE t.user_id = b.user_id AND t.category_id = b.category_id AND strftime('%Y-%m', t.date) = strftime('%Y-%m', b.month)) as spent
         FROM budgets b
         WHERE b.user_id = ?`,
        [userId]
    );
};