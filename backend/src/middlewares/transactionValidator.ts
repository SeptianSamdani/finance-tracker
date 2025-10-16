import { Request, Response, NextFunction } from 'express';

export const validateCreateTransaction = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { amount, type, transaction_date } = req.body;

  // Check required fields
  if (!amount || !type || !transaction_date) {
    res.status(400).json({
      success: false,
      message: 'Amount, type, and transaction_date are required',
    });
    return;
  }

  // Validate amount
  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({
      success: false,
      message: 'Amount must be a positive number',
    });
    return;
  }

  // Validate type
  if (type !== 'income' && type !== 'expense') {
    res.status(400).json({
      success: false,
      message: 'Type must be either "income" or "expense"',
    });
    return;
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(transaction_date)) {
    res.status(400).json({
      success: false,
      message: 'Transaction date must be in YYYY-MM-DD format',
    });
    return;
  }

  // Validate category_id if provided
  if (req.body.category_id !== undefined && req.body.category_id !== null) {
    const categoryId = parseInt(req.body.category_id);
    if (isNaN(categoryId) || categoryId <= 0) {
      res.status(400).json({
        success: false,
        message: 'Category ID must be a positive integer',
      });
      return;
    }
  }

  next();
};

export const validateUpdateTransaction = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { amount, type, transaction_date } = req.body;

  // Validate amount if provided
  if (amount !== undefined) {
    if (typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
      return;
    }
  }

  // Validate type if provided
  if (type !== undefined) {
    if (type !== 'income' && type !== 'expense') {
      res.status(400).json({
        success: false,
        message: 'Type must be either "income" or "expense"',
      });
      return;
    }
  }

  // Validate date format if provided
  if (transaction_date !== undefined) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(transaction_date)) {
      res.status(400).json({
        success: false,
        message: 'Transaction date must be in YYYY-MM-DD format',
      });
      return;
    }
  }

  // Validate category_id if provided
  if (req.body.category_id !== undefined && req.body.category_id !== null) {
    const categoryId = parseInt(req.body.category_id);
    if (isNaN(categoryId) || categoryId <= 0) {
      res.status(400).json({
        success: false,
        message: 'Category ID must be a positive integer',
      });
      return;
    }
  }

  next();
};