import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '../utils/db';
import { SavingsGoal } from '../models/savingsGoal.model';

// Tạo mục tiêu tiết kiệm mới
export const createSavingsGoal = async (userId: string, data: Partial<SavingsGoal>) => {
    const db = await connectToDatabase();
    const id = uuidv4();
    await db.run(
        `INSERT INTO savings_goals (id, user_id, name, target_amount, current_amount, target_date, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            userId,
            data.name,
            data.targetAmount,
            data.currentAmount || 0,
            data.targetDate,
            new Date().toISOString()
        ]
    );
    return { ...data, id, userId };
};

// Lấy danh sách mục tiêu tiết kiệm của user
export const getAllSavingsGoals = async (userId: string) => {
    const db = await connectToDatabase();
    return db.all(
        `SELECT * FROM savings_goals WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
    );
};

// Cập nhật mục tiêu tiết kiệm
export const updateSavingsGoal = async (id: string, data: Partial<SavingsGoal>) => {
    const db = await connectToDatabase();
    const fields = Object.keys(data).map(key =>
        `${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`
    ).join(', ');
    const values = Object.values(data);
    await db.run(
        `UPDATE savings_goals SET ${fields} WHERE id = ?`,
        [...values, id]
    );
    return { id, ...data };
};

// Xóa mục tiêu tiết kiệm
export const deleteSavingsGoal = async (id: string) => {
    const db = await connectToDatabase();
    await db.run(`DELETE FROM savings_goals WHERE id = ?`, [id]);
    return { message: 'Savings goal deleted successfully' };
};

// Đóng góp vào mục tiêu tiết kiệm
export const contributeToSavingsGoal = async (id: string, amount: number) => {
    const db = await connectToDatabase();
    await db.run(
        `UPDATE savings_goals SET current_amount = current_amount + ? WHERE id = ?`,
        [amount, id]
    );
    return { id, contributed: amount };
};

// Lấy tiến độ mục tiêu tiết kiệm
export const getSavingsGoalProgress = async (id: string) => {
    const db = await connectToDatabase();
    return db.get(
        `SELECT id, name, target_amount, current_amount, target_date, created_at FROM savings_goals WHERE id = ?`,
        [id]
    );
};