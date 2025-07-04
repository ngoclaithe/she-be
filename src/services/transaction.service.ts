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
    const db = await connectToDatabase();
    const {
        id, userId, categoryId, amount, description, type, date, createdAt
    } = transactionData;
    await db.run(
        `INSERT INTO transactions (id, user_id, category_id, amount, description, type, date, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, userId, categoryId, amount, description, type, date, createdAt]
    );
    return transactionData;
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
    const start = `${month}-01`;
    const end = `${month}-31`;
    const summary = await db.all(
        `SELECT type, SUM(amount) as total
         FROM transactions
         WHERE user_id = ? AND date BETWEEN ? AND ?
         GROUP BY type`,
        [userId, start, end]
    );
    return summary;
};