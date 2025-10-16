import pool from '../config/database.js';
import {
  Transaction,
  TransactionWithCategory,
  TransactionInput,
  TransactionFilter,
} from '../types/index.js';

export const createTransaction = async (
  userId: number,
  data: TransactionInput
): Promise<TransactionWithCategory> => {
  const { category_id, amount, type, description, transaction_date } = data;

  // Verify category belongs to user (if category_id provided)
  if (category_id) {
    const categoryCheck = await pool.query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [category_id, userId]
    );

    if (categoryCheck.rows.length === 0) {
      throw new Error('Category not found or does not belong to user');
    }
  }

  // Insert transaction
  const result = await pool.query(
    `INSERT INTO transactions (user_id, category_id, amount, type, description, transaction_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, category_id || null, amount, type, description || null, transaction_date]
  );

  const transaction = result.rows[0];

  // Get category details if exists
  if (transaction.category_id) {
    const categoryResult = await pool.query(
      'SELECT name, color, icon FROM categories WHERE id = $1',
      [transaction.category_id]
    );

    const category = categoryResult.rows[0];
    return {
      ...transaction,
      category_name: category.name,
      category_color: category.color,
      category_icon: category.icon,
    };
  }

  return transaction;
};

export const getTransactions = async (
  userId: number,
  filters?: TransactionFilter
): Promise<TransactionWithCategory[]> => {
  let query = `
    SELECT 
      t.*,
      c.name as category_name,
      c.color as category_color,
      c.icon as category_icon
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1
  `;

  const params: any[] = [userId];
  let paramCount = 1;

  // Apply filters
  if (filters?.type) {
    paramCount++;
    query += ` AND t.type = $${paramCount}`;
    params.push(filters.type);
  }

  if (filters?.category_id) {
    paramCount++;
    query += ` AND t.category_id = $${paramCount}`;
    params.push(filters.category_id);
  }

  if (filters?.start_date) {
    paramCount++;
    query += ` AND t.transaction_date >= $${paramCount}`;
    params.push(filters.start_date);
  }

  if (filters?.end_date) {
    paramCount++;
    query += ` AND t.transaction_date <= $${paramCount}`;
    params.push(filters.end_date);
  }

  if (filters?.min_amount) {
    paramCount++;
    query += ` AND t.amount >= $${paramCount}`;
    params.push(filters.min_amount);
  }

  if (filters?.max_amount) {
    paramCount++;
    query += ` AND t.amount <= $${paramCount}`;
    params.push(filters.max_amount);
  }

  query += ' ORDER BY t.transaction_date DESC, t.created_at DESC';

  const result = await pool.query(query, params);
  return result.rows;
};

export const getTransactionById = async (
  userId: number,
  transactionId: number
): Promise<TransactionWithCategory> => {
  const result = await pool.query(
    `SELECT 
      t.*,
      c.name as category_name,
      c.color as category_color,
      c.icon as category_icon
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.id = $1 AND t.user_id = $2`,
    [transactionId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Transaction not found');
  }

  return result.rows[0];
};

export const updateTransaction = async (
  userId: number,
  transactionId: number,
  data: Partial<TransactionInput>
): Promise<TransactionWithCategory> => {
  // Check if transaction exists and belongs to user
  const existing = await pool.query(
    'SELECT id FROM transactions WHERE id = $1 AND user_id = $2',
    [transactionId, userId]
  );

  if (existing.rows.length === 0) {
    throw new Error('Transaction not found');
  }

  // Verify category if provided
  if (data.category_id) {
    const categoryCheck = await pool.query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [data.category_id, userId]
    );

    if (categoryCheck.rows.length === 0) {
      throw new Error('Category not found or does not belong to user');
    }
  }

  // Build update query dynamically
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 0;

  if (data.category_id !== undefined) {
    paramCount++;
    updates.push(`category_id = $${paramCount}`);
    values.push(data.category_id);
  }

  if (data.amount !== undefined) {
    paramCount++;
    updates.push(`amount = $${paramCount}`);
    values.push(data.amount);
  }

  if (data.type !== undefined) {
    paramCount++;
    updates.push(`type = $${paramCount}`);
    values.push(data.type);
  }

  if (data.description !== undefined) {
    paramCount++;
    updates.push(`description = $${paramCount}`);
    values.push(data.description);
  }

  if (data.transaction_date !== undefined) {
    paramCount++;
    updates.push(`transaction_date = $${paramCount}`);
    values.push(data.transaction_date);
  }

  if (updates.length === 0) {
    throw new Error('No fields to update');
  }

  paramCount++;
  values.push(transactionId);
  paramCount++;
  values.push(userId);

  const query = `
    UPDATE transactions
    SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${paramCount - 1} AND user_id = $${paramCount}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  const transaction = result.rows[0];

  // Get category details if exists
  if (transaction.category_id) {
    const categoryResult = await pool.query(
      'SELECT name, color, icon FROM categories WHERE id = $1',
      [transaction.category_id]
    );

    const category = categoryResult.rows[0];
    return {
      ...transaction,
      category_name: category.name,
      category_color: category.color,
      category_icon: category.icon,
    };
  }

  return transaction;
};

export const deleteTransaction = async (
  userId: number,
  transactionId: number
): Promise<void> => {
  const result = await pool.query(
    'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
    [transactionId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Transaction not found');
  }
};

export const getTransactionStats = async (userId: number) => {
  const result = await pool.query(
    `SELECT 
      COUNT(*) as total_transactions,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
      SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance
    FROM transactions
    WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0];
};