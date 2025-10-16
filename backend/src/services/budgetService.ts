import pool from '../config/database.js';
import { Budget, BudgetWithCategory, BudgetInput } from '../types/index.js';

export const createBudget = async (
  userId: number,
  data: BudgetInput
): Promise<BudgetWithCategory> => {
  const { category_id, amount, period, start_date, end_date } = data;

  // Verify category belongs to user and is expense type
  const categoryCheck = await pool.query(
    'SELECT id, name, type FROM categories WHERE id = $1 AND user_id = $2',
    [category_id, userId]
  );

  if (categoryCheck.rows.length === 0) {
    throw new Error('Category not found or does not belong to user');
  }

  if (categoryCheck.rows[0].type !== 'expense') {
    throw new Error('Budget can only be set for expense categories');
  }

  // Check if budget already exists for this category and period overlap
  const overlapCheck = await pool.query(
    `SELECT id FROM budgets 
     WHERE user_id = $1 AND category_id = $2
     AND (
       (start_date <= $3 AND end_date >= $3) OR
       (start_date <= $4 AND end_date >= $4) OR
       (start_date >= $3 AND end_date <= $4)
     )`,
    [userId, category_id, start_date, end_date]
  );

  if (overlapCheck.rows.length > 0) {
    throw new Error('Budget already exists for this category in the specified period');
  }

  // Insert budget
  const result = await pool.query(
    `INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, category_id, amount, period, start_date, end_date]
  );

  const budget = result.rows[0];

  // Get spent amount for this budget period
  const spentResult = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) as spent
     FROM transactions
     WHERE user_id = $1 
     AND category_id = $2 
     AND type = 'expense'
     AND transaction_date BETWEEN $3 AND $4`,
    [userId, category_id, start_date, end_date]
  );

  const spentAmount = parseFloat(spentResult.rows[0].spent);
  const remainingAmount = budget.amount - spentAmount;
  const percentageUsed = (spentAmount / budget.amount) * 100;

  return {
    ...budget,
    category_name: categoryCheck.rows[0].name,
    category_color: '#000000', // Will be fetched in detailed query
    spent_amount: spentAmount,
    remaining_amount: remainingAmount,
    percentage_used: percentageUsed,
  };
};

export const getBudgets = async (
  userId: number,
  period?: 'monthly' | 'yearly'
): Promise<BudgetWithCategory[]> => {
  let query = `
    SELECT 
      b.*,
      c.name as category_name,
      c.color as category_color,
      COALESCE(SUM(t.amount), 0) as spent_amount
    FROM budgets b
    JOIN categories c ON b.category_id = c.id
    LEFT JOIN transactions t ON t.category_id = b.category_id 
      AND t.user_id = b.user_id
      AND t.type = 'expense'
      AND t.transaction_date BETWEEN b.start_date AND b.end_date
    WHERE b.user_id = $1
  `;

  const params: any[] = [userId];

  if (period) {
    query += ' AND b.period = $2';
    params.push(period);
  }

  query += ' GROUP BY b.id, c.name, c.color ORDER BY b.start_date DESC';

  const result = await pool.query(query, params);

  return result.rows.map((row: any) => {
    const spentAmount = parseFloat(row.spent_amount);
    const remainingAmount = row.amount - spentAmount;
    const percentageUsed = (spentAmount / row.amount) * 100;

    return {
      ...row,
      spent_amount: spentAmount,
      remaining_amount: remainingAmount,
      percentage_used: Math.min(percentageUsed, 100), // Cap at 100%
    };
  });
};

export const getBudgetById = async (
  userId: number,
  budgetId: number
): Promise<BudgetWithCategory> => {
  const result = await pool.query(
    `SELECT 
      b.*,
      c.name as category_name,
      c.color as category_color,
      COALESCE(SUM(t.amount), 0) as spent_amount
    FROM budgets b
    JOIN categories c ON b.category_id = c.id
    LEFT JOIN transactions t ON t.category_id = b.category_id 
      AND t.user_id = b.user_id
      AND t.type = 'expense'
      AND t.transaction_date BETWEEN b.start_date AND b.end_date
    WHERE b.id = $1 AND b.user_id = $2
    GROUP BY b.id, c.name, c.color`,
    [budgetId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Budget not found');
  }

  const row = result.rows[0];
  const spentAmount = parseFloat(row.spent_amount);
  const remainingAmount = row.amount - spentAmount;
  const percentageUsed = (spentAmount / row.amount) * 100;

  return {
    ...row,
    spent_amount: spentAmount,
    remaining_amount: remainingAmount,
    percentage_used: Math.min(percentageUsed, 100),
  };
};

export const updateBudget = async (
  userId: number,
  budgetId: number,
  data: Partial<BudgetInput>
): Promise<BudgetWithCategory> => {
  // Check if budget exists and belongs to user
  const existing = await pool.query(
    'SELECT * FROM budgets WHERE id = $1 AND user_id = $2',
    [budgetId, userId]
  );

  if (existing.rows.length === 0) {
    throw new Error('Budget not found');
  }

  const currentBudget = existing.rows[0];

  // Verify category if provided
  if (data.category_id) {
    const categoryCheck = await pool.query(
      'SELECT id, type FROM categories WHERE id = $1 AND user_id = $2',
      [data.category_id, userId]
    );

    if (categoryCheck.rows.length === 0) {
      throw new Error('Category not found or does not belong to user');
    }

    if (categoryCheck.rows[0].type !== 'expense') {
      throw new Error('Budget can only be set for expense categories');
    }
  }

  // Check for overlapping budgets if dates or category are being updated
  if (data.category_id || data.start_date || data.end_date) {
    const categoryId = data.category_id || currentBudget.category_id;
    const startDate = data.start_date || currentBudget.start_date;
    const endDate = data.end_date || currentBudget.end_date;

    const overlapCheck = await pool.query(
      `SELECT id FROM budgets 
       WHERE user_id = $1 AND category_id = $2 AND id != $3
       AND (
         (start_date <= $4 AND end_date >= $4) OR
         (start_date <= $5 AND end_date >= $5) OR
         (start_date >= $4 AND end_date <= $5)
       )`,
      [userId, categoryId, budgetId, startDate, endDate]
    );

    if (overlapCheck.rows.length > 0) {
      throw new Error('Budget already exists for this category in the specified period');
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

  if (data.period !== undefined) {
    paramCount++;
    updates.push(`period = $${paramCount}`);
    values.push(data.period);
  }

  if (data.start_date !== undefined) {
    paramCount++;
    updates.push(`start_date = $${paramCount}`);
    values.push(data.start_date);
  }

  if (data.end_date !== undefined) {
    paramCount++;
    updates.push(`end_date = $${paramCount}`);
    values.push(data.end_date);
  }

  if (updates.length === 0) {
    throw new Error('No fields to update');
  }

  paramCount++;
  values.push(budgetId);
  paramCount++;
  values.push(userId);

  const query = `
    UPDATE budgets
    SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${paramCount - 1} AND user_id = $${paramCount}
    RETURNING *
  `;

  await pool.query(query, values);

  // Return updated budget with calculations
  return await getBudgetById(userId, budgetId);
};

export const deleteBudget = async (
  userId: number,
  budgetId: number
): Promise<void> => {
  const result = await pool.query(
    'DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING id',
    [budgetId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Budget not found');
  }
};

export const getBudgetSummary = async (userId: number) => {
  const result = await pool.query(
    `SELECT 
      COUNT(*) as total_budgets,
      SUM(b.amount) as total_budget_amount,
      SUM(COALESCE(t.spent, 0)) as total_spent,
      SUM(b.amount) - SUM(COALESCE(t.spent, 0)) as total_remaining,
      COUNT(CASE WHEN COALESCE(t.spent, 0) > b.amount THEN 1 END) as over_budget_count
    FROM budgets b
    LEFT JOIN (
      SELECT 
        category_id,
        SUM(amount) as spent
      FROM transactions
      WHERE user_id = $1 AND type = 'expense'
      GROUP BY category_id
    ) t ON b.category_id = t.category_id
    WHERE b.user_id = $1 
    AND CURRENT_DATE BETWEEN b.start_date AND b.end_date`,
    [userId]
  );

  return result.rows[0];
};