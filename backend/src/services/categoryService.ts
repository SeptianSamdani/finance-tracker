import pool from '../config/database.js';
import { Category, CategoryInput } from '../types/index.js';

export const createCategory = async (
  userId: number,
  data: CategoryInput
): Promise<Category> => {
  const { name, type, color, icon } = data;

  // Check if category with same name and type already exists
  const existing = await pool.query(
    'SELECT id FROM categories WHERE user_id = $1 AND name = $2 AND type = $3',
    [userId, name, type]
  );

  if (existing.rows.length > 0) {
    throw new Error('Category with this name and type already exists');
  }

  // Insert category
  const result = await pool.query(
    `INSERT INTO categories (user_id, name, type, color, icon)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, name, type, color || '#000000', icon || null]
  );

  return result.rows[0];
};

export const getCategories = async (
  userId: number,
  type?: 'income' | 'expense'
): Promise<Category[]> => {
  let query = 'SELECT * FROM categories WHERE user_id = $1';
  const params: any[] = [userId];

  if (type) {
    query += ' AND type = $2';
    params.push(type);
  }

  query += ' ORDER BY name ASC';

  const result = await pool.query(query, params);
  return result.rows;
};

export const getCategoryById = async (
  userId: number,
  categoryId: number
): Promise<Category> => {
  const result = await pool.query(
    'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
    [categoryId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Category not found');
  }

  return result.rows[0];
};

export const updateCategory = async (
  userId: number,
  categoryId: number,
  data: Partial<CategoryInput>
): Promise<Category> => {
  // Check if category exists and belongs to user
  const existing = await pool.query(
    'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
    [categoryId, userId]
  );

  if (existing.rows.length === 0) {
    throw new Error('Category not found');
  }

  // Check for duplicate name if name is being updated
  if (data.name || data.type) {
    const currentCategory = await pool.query(
      'SELECT name, type FROM categories WHERE id = $1',
      [categoryId]
    );

    const nameToCheck = data.name || currentCategory.rows[0].name;
    const typeToCheck = data.type || currentCategory.rows[0].type;

    const duplicate = await pool.query(
      'SELECT id FROM categories WHERE user_id = $1 AND name = $2 AND type = $3 AND id != $4',
      [userId, nameToCheck, typeToCheck, categoryId]
    );

    if (duplicate.rows.length > 0) {
      throw new Error('Category with this name and type already exists');
    }
  }

  // Build update query dynamically
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 0;

  if (data.name !== undefined) {
    paramCount++;
    updates.push(`name = $${paramCount}`);
    values.push(data.name);
  }

  if (data.type !== undefined) {
    paramCount++;
    updates.push(`type = $${paramCount}`);
    values.push(data.type);
  }

  if (data.color !== undefined) {
    paramCount++;
    updates.push(`color = $${paramCount}`);
    values.push(data.color);
  }

  if (data.icon !== undefined) {
    paramCount++;
    updates.push(`icon = $${paramCount}`);
    values.push(data.icon);
  }

  if (updates.length === 0) {
    throw new Error('No fields to update');
  }

  paramCount++;
  values.push(categoryId);
  paramCount++;
  values.push(userId);

  const query = `
    UPDATE categories
    SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${paramCount - 1} AND user_id = $${paramCount}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteCategory = async (
  userId: number,
  categoryId: number
): Promise<void> => {
  // Check if category has transactions
  const transactionCheck = await pool.query(
    'SELECT COUNT(*) as count FROM transactions WHERE category_id = $1',
    [categoryId]
  );

  const transactionCount = parseInt(transactionCheck.rows[0].count);

  if (transactionCount > 0) {
    throw new Error(
      `Cannot delete category. It has ${transactionCount} transaction(s) associated with it. Please delete or reassign the transactions first.`
    );
  }

  // Delete category
  const result = await pool.query(
    'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id',
    [categoryId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Category not found');
  }
};

export const getCategoryStats = async (userId: number) => {
  const result = await pool.query(
    `SELECT 
      c.id,
      c.name,
      c.type,
      c.color,
      c.icon,
      COUNT(t.id) as transaction_count,
      COALESCE(SUM(t.amount), 0) as total_amount
    FROM categories c
    LEFT JOIN transactions t ON c.id = t.category_id
    WHERE c.user_id = $1
    GROUP BY c.id, c.name, c.type, c.color, c.icon
    ORDER BY total_amount DESC`,
    [userId]
  );

  return result.rows;
};