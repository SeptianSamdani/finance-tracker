import pool from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { RegisterInput, LoginInput, AuthResponse, UserResponse } from '../types/index.js';

export const registerUser = async (data: RegisterInput): Promise<AuthResponse> => {
  const { email, password, full_name } = data;

  // Check if user already exists
  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Insert user
  const result = await pool.query(
    `INSERT INTO users (email, password, full_name) 
     VALUES ($1, $2, $3) 
     RETURNING id, email, full_name, created_at`,
    [email.toLowerCase(), hashedPassword, full_name]
  );

  const user = result.rows[0];

  // Create default categories for new user
  await createDefaultCategories(user.id);

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      created_at: user.created_at,
    },
    token,
  };
};

export const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
  const { email, password } = data;

  // Find user
  const result = await pool.query(
    'SELECT id, email, password, full_name, created_at FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];

  // Compare password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      created_at: user.created_at,
    },
    token,
  };
};

export const getUserProfile = async (userId: number): Promise<UserResponse> => {
  const result = await pool.query(
    'SELECT id, email, full_name, created_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
};

// Helper function to create default categories
const createDefaultCategories = async (userId: number): Promise<void> => {
  await pool.query(
    `INSERT INTO categories (user_id, name, type, color, icon)
     SELECT $1, name, type, color, icon
     FROM default_categories`,
    [userId]
  );
};