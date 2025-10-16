-- Migration: Seed Default Categories
-- Created: 2024-10-15
-- Note: These are template categories. Users will get copies when they register.

-- This creates a template table for default categories
CREATE TABLE IF NOT EXISTS default_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    color VARCHAR(7) DEFAULT '#000000',
    icon VARCHAR(50)
);

-- Insert default expense categories
INSERT INTO default_categories (name, type, color, icon) VALUES
    ('Food & Dining', 'expense', '#FF6B6B', '🍔'),
    ('Transportation', 'expense', '#4ECDC4', '🚗'),
    ('Shopping', 'expense', '#FFE66D', '🛍️'),
    ('Entertainment', 'expense', '#A8DADC', '🎬'),
    ('Bills & Utilities', 'expense', '#457B9D', '💡'),
    ('Healthcare', 'expense', '#E63946', '🏥'),
    ('Education', 'expense', '#F1FAEE', '📚'),
    ('Personal Care', 'expense', '#FCA311', '💇'),
    ('Housing', 'expense', '#14213D', '🏠'),
    ('Other Expenses', 'expense', '#6C757D', '📌');

-- Insert default income categories
INSERT INTO default_categories (name, type, color, icon) VALUES
    ('Salary', 'income', '#06D6A0', '💰'),
    ('Freelance', 'income', '#118AB2', '💼'),
    ('Investment', 'income', '#073B4C', '📈'),
    ('Business', 'income', '#EF476F', '🏢'),
    ('Gift', 'income', '#FFD166', '🎁'),
    ('Other Income', 'income', '#26547C', '📊');