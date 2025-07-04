import { connectToDatabase } from '../utils/db';

// Báo cáo tháng
export const getMonthlyReport = async (userId: string, year: number, month: number) => {
    const db = await connectToDatabase();
    const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
    const transactions = await db.all(
        `SELECT * FROM transactions WHERE user_id = ? AND strftime('%Y-%m', date) = ?`,
        [userId, monthStr]
    );
    const totalIncome = transactions
        .filter((t: any) => t.type === 'income')
        .reduce((acc: number, t: any) => acc + t.amount, 0);
    const totalExpense = transactions
        .filter((t: any) => t.type === 'expense')
        .reduce((acc: number, t: any) => acc + t.amount, 0);
    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
    };
};

// Báo cáo năm
export const getYearlyReport = async (userId: string, year: number) => {
    const db = await connectToDatabase();
    const reports = [];
    for (let month = 1; month <= 12; month++) {
        const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
        const transactions = await db.all(
            `SELECT * FROM transactions WHERE user_id = ? AND strftime('%Y-%m', date) = ?`,
            [userId, monthStr]
        );
        const totalIncome = transactions
            .filter((t: any) => t.type === 'income')
            .reduce((acc: number, t: any) => acc + t.amount, 0);
        const totalExpense = transactions
            .filter((t: any) => t.type === 'expense')
            .reduce((acc: number, t: any) => acc + t.amount, 0);
        reports.push({
            month,
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
        });
    }
    return reports;
};

// Thống kê theo category
export const getCategoryStatistics = async (userId: string) => {
    const db = await connectToDatabase();
    return db.all(
        `SELECT c.name as category, 
                SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as totalIncome,
                SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as totalExpense
         FROM categories c
         LEFT JOIN transactions t ON c.id = t.category_id
         WHERE c.user_id = ?
         GROUP BY c.id, c.name
         ORDER BY c.name`,
        [userId]
    );
};