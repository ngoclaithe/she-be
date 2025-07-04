import { connectToDatabase } from '../utils/db';

export const getMonthlySavings = async (userId: string, month: string): Promise<number> => {
    const db = await connectToDatabase();
    
    // Lấy tổng số tiền tiết kiệm trong tháng
    const result = await db.get(
        `SELECT COALESCE(SUM(amount), 0) as total
         FROM transactions 
         WHERE user_id = ? 
         AND type = 'savings' 
         AND strftime('%Y-%m', date) = ?`,
        [userId, month]
    );
    
    return result?.total || 0;
};
