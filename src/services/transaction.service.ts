import { connectToDatabase } from '../utils/db';

export const getTransactions = async (
    page: number,
    limit: number,
    type?: string,
    category?: string
) => {
    const db = await connectToDatabase();
    let query = `SELECT * FROM transactions WHERE 1=1`;
    const params: any[] = [];

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

export const createTransaction = async (transactionData: any) => {
    console.log('Starting to create transaction with data:', transactionData);
    const db = await connectToDatabase();
    const {
        id, userId, categoryId, amount, description, type, date, createdAt
    } = transactionData;

    // Validate required fields
    if (!id || !userId || !categoryId || amount === undefined || !type || !date || !createdAt) {
        const errorMsg = 'Missing required transaction fields';
        console.error(errorMsg, { id, userId, categoryId, amount, type, date, createdAt });
        throw new Error(errorMsg);
    }

    try {
        console.log('Executing database insert...');
        const result = await db.run(
            `INSERT INTO transactions 
             (id, user_id, category_id, amount, description, type, date, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, userId, categoryId, amount, description, type, date, createdAt]
        );
        
        console.log('Database insert result:', { 
            changes: result.changes, 
            lastID: result.lastID 
        });
        
        // Return the created transaction with all fields
        const newTransaction = {
            id,
            userId,
            categoryId,
            amount,
            description,
            type,
            date,
            createdAt
        };
        
        console.log('Successfully created transaction:', newTransaction);
        return newTransaction;
    } catch (error) {
        console.error('Error in createTransaction:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            transactionData
        });
        throw error;
    }
};

export const updateTransaction = async (id: string, updateData: any) => {
    const db = await connectToDatabase();
    const fields = Object.keys(updateData).map(key =>
        `${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`
    ).join(', ');
    const values = Object.values(updateData);
    await db.run(
        `UPDATE transactions SET ${fields} WHERE id = ?`,
        [...values, id]
    );
    return { id, ...updateData };
};

export const deleteTransaction = async (id: string) => {
    const db = await connectToDatabase();
    await db.run(`DELETE FROM transactions WHERE id = ?`, [id]);
    return { message: 'Transaction deleted successfully' };
};

export const getTransactionSummary = async (userId: string, month: string) => {
    const db = await connectToDatabase();
    return db.get(
        `SELECT 
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as totalIncome,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as totalExpense
         FROM transactions 
         WHERE user_id = ? AND strftime('%Y-%m', date) = ?`,
        [userId, month]
    );
};

export const getMonthlyTransactionSummary = async (userId: string, month: string, type: 'income' | 'expense') => {
    const db = await connectToDatabase();
    const result = await db.get(
        `SELECT COALESCE(SUM(amount), 0) as total
         FROM transactions 
         WHERE user_id = ? 
         AND type = ? 
         AND strftime('%Y-%m', date) = ?`,
        [userId, type, month]
    );
    return result?.total || 0;
};

export const getRecentTransactions = async (userId: string, limit: number = 5) => {
    const db = await connectToDatabase();
    return db.all(
        `SELECT t.*, c.name as category_name, c.icon as category_icon
         FROM transactions t
         LEFT JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = ?
         ORDER BY t.date DESC, t.created_at DESC
         LIMIT ?`,
        [userId, limit]
    );
};