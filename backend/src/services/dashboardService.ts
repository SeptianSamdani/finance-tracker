import pool from '../config/database.js';

// 1. Overall Summary
export const getOverallSummary = async (userId: number) => {
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

  const data = result.rows[0];
  
  return {
    total_transactions: parseInt(data.total_transactions || '0'),
    total_income: parseFloat(data.total_income || '0'),
    total_expense: parseFloat(data.total_expense || '0'),
    balance: parseFloat(data.balance || '0'),
  };
};

// 2. Monthly Summary (Last 6 months)
export const getMonthlySummary = async (userId: number) => {
  const result = await pool.query(
    `SELECT 
      TO_CHAR(transaction_date, 'YYYY-MM') as month,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
    FROM transactions
    WHERE user_id = $1
      AND transaction_date >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY TO_CHAR(transaction_date, 'YYYY-MM')
    ORDER BY month ASC`,
    [userId]
  );

  return result.rows.map(row => ({
    month: row.month,
    income: parseFloat(row.income || '0'),
    expense: parseFloat(row.expense || '0'),
    balance: parseFloat(row.income || '0') - parseFloat(row.expense || '0'),
  }));
};

// 3. Category Breakdown (Top 5 by spending)
export const getCategoryBreakdown = async (userId: number) => {
  const result = await pool.query(
    `SELECT 
      c.id,
      c.name,
      c.color,
      c.icon,
      c.type,
      SUM(t.amount) as total_amount,
      COUNT(t.id) as transaction_count
    FROM categories c
    LEFT JOIN transactions t ON c.id = t.category_id AND t.user_id = $1
    WHERE c.user_id = $1
    GROUP BY c.id, c.name, c.color, c.icon, c.type
    HAVING SUM(t.amount) > 0
    ORDER BY total_amount DESC
    LIMIT 10`,
    [userId]
  );

  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    color: row.color,
    icon: row.icon,
    type: row.type,
    total_amount: parseFloat(row.total_amount || '0'),
    transaction_count: parseInt(row.transaction_count || '0'),
  }));
};

// 4. Recent Transactions (Last 10)
export const getRecentTransactions = async (userId: number) => {
  const result = await pool.query(
    `SELECT 
      t.id,
      t.amount,
      t.type,
      t.description,
      t.transaction_date,
      c.name as category_name,
      c.color as category_color,
      c.icon as category_icon
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1
    ORDER BY t.transaction_date DESC, t.created_at DESC
    LIMIT 10`,
    [userId]
  );

  return result.rows.map(row => ({
    id: row.id,
    amount: parseFloat(row.amount),
    type: row.type,
    description: row.description,
    transaction_date: row.transaction_date,
    category_name: row.category_name,
    category_color: row.category_color,
    category_icon: row.category_icon,
  }));
};

// 5. Get Complete Dashboard (All in one)
export const getCompleteDashboard = async (userId: number) => {
  const [summary, monthly, categories, recent] = await Promise.all([
    getOverallSummary(userId),
    getMonthlySummary(userId),
    getCategoryBreakdown(userId),
    getRecentTransactions(userId),
  ]);

  return {
    summary,
    monthly_trend: monthly,
    category_breakdown: categories,
    recent_transactions: recent,
  };
};