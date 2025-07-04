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

export const getBudgetAlerts = async (userId: string) => {
    const db = await connectToDatabase();
    const currentMonth = new Date().toISOString().slice(0, 7); 
    
    console.log(`[${new Date().toISOString()}] Lấy thông tin ngân sách cho user ${userId}, tháng ${currentMonth}`);
    
    const budgets = await db.all(
        `SELECT 
            b.*,
            c.name as category_name,
            c.icon as category_icon,
            c.color as category_color,
            (SELECT COALESCE(SUM(amount), 0) 
             FROM transactions t 
             WHERE t.user_id = b.user_id 
             AND t.category_id = b.category_id 
             AND t.type = 'expense'
             AND strftime('%Y-%m', t.date) = ?) as spent
         FROM budgets b
         JOIN categories c ON b.category_id = c.id
         WHERE b.user_id = ? AND b.month = ?
         ORDER BY c.name ASC`,  
        [currentMonth, userId, currentMonth]
    );

    console.log(`Tìm thấy ${budgets.length} ngân sách trong tháng`);

    const budgetDetails = await Promise.all(budgets.map(async (budget: any) => {
        const spent = budget.spent || 0;
        const remaining = Math.max(0, budget.amount - spent);
        const usagePercentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
        
        let alertLevel = 'success';
        let message = '';
        
        if (budget.amount === 0) {
            message = 'Chưa đặt ngân sách';
            alertLevel = 'info';
        } else if (spent >= budget.amount) {
            alertLevel = 'danger';
            message = `Đã vượt quá ngân sách ${(usagePercentage - 100).toFixed(0)}%`;
        } else if (usagePercentage >= 80) {
            alertLevel = 'warning';
            message = `Sắp vượt quá ngân sách (${usagePercentage.toFixed(0)}% đã sử dụng)`;
        } else if (usagePercentage >= 50) {
            alertLevel = 'info';
            message = `Đã sử dụng ${usagePercentage.toFixed(0)}% ngân sách`;
        } else {
            message = `Đã sử dụng ${usagePercentage.toFixed(0)}% ngân sách`;
        }
        
        const formatCurrency = (amount: number) => {
            return new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND',
                maximumFractionDigits: 0
            }).format(amount);
        };
        
        return {
            id: budget.id,
            categoryId: budget.category_id,
            categoryName: budget.category_name,
            categoryIcon: budget.category_icon,
            categoryColor: budget.category_color,
            budgetAmount: budget.amount,
            budgetAmountFormatted: formatCurrency(budget.amount),
            spent: spent,
            spentFormatted: formatCurrency(spent),
            remaining: remaining,
            remainingFormatted: formatCurrency(remaining),
            usagePercentage: parseFloat(usagePercentage.toFixed(2)),
            month: budget.month,
            alertLevel,
            message,
            lastUpdated: new Date().toISOString(),
            // Thêm thông tin bổ sung
            progress: Math.min(100, Math.max(0, usagePercentage)), // Đảm bảo progress từ 0-100
            isOverBudget: spent > budget.amount,
            daysRemainingInMonth: new Date(
                new Date().getFullYear(), 
                new Date().getMonth() + 1, 
                0
            ).getDate() - new Date().getDate()
        };
    }));
    
    console.log(`Đã xử lý thông tin cho ${budgetDetails.length} ngân sách`);
    return budgetDetails;
};