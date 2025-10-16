import { Request, Response, NextFunction } from 'express';

export const validateCreateBudget = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { category_id, amount, period, start_date, end_date } = req.body;

  // Check required fields
  if (!category_id || !amount || !period || !start_date || !end_date) {
    res.status(400).json({
      success: false,
      message: 'All fields are required (category_id, amount, period, start_date, end_date)',
    });
    return;
  }

  // Validate category_id
  const categoryId = parseInt(category_id);
  if (isNaN(categoryId) || categoryId <= 0) {
    res.status(400).json({
      success: false,
      message: 'Category ID must be a positive integer',
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

  // Validate period
  if (period !== 'monthly' && period !== 'yearly') {
    res.status(400).json({
      success: false,
      message: 'Period must be either "monthly" or "yearly"',
    });
    return;
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(start_date)) {
    res.status(400).json({
      success: false,
      message: 'Start date must be in YYYY-MM-DD format',
    });
    return;
  }

  if (!dateRegex.test(end_date)) {
    res.status(400).json({
      success: false,
      message: 'End date must be in YYYY-MM-DD format',
    });
    return;
  }

  // Validate date logic
  const startDateObj = new Date(start_date);
  const endDateObj = new Date(end_date);

  if (endDateObj <= startDateObj) {
    res.status(400).json({
      success: false,
      message: 'End date must be after start date',
    });
    return;
  }

  // Validate period consistency
  const daysDiff = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  if (period === 'monthly' && daysDiff > 31) {
    res.status(400).json({
      success: false,
      message: 'Monthly budget should not exceed 31 days',
    });
    return;
  }

  if (period === 'yearly' && daysDiff > 366) {
    res.status(400).json({
      success: false,
      message: 'Yearly budget should not exceed 366 days',
    });
    return;
  }

  next();
};

export const validateUpdateBudget = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { category_id, amount, period, start_date, end_date } = req.body;

  // At least one field must be provided
  if (
    category_id === undefined &&
    amount === undefined &&
    period === undefined &&
    start_date === undefined &&
    end_date === undefined
  ) {
    res.status(400).json({
      success: false,
      message: 'At least one field must be provided for update',
    });
    return;
  }

  // Validate category_id if provided
  if (category_id !== undefined) {
    const categoryIdNum = parseInt(category_id);
    if (isNaN(categoryIdNum) || categoryIdNum <= 0) {
      res.status(400).json({
        success: false,
        message: 'Category ID must be a positive integer',
      });
      return;
    }
  }

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

  // Validate period if provided
  if (period !== undefined) {
    if (period !== 'monthly' && period !== 'yearly') {
      res.status(400).json({
        success: false,
        message: 'Period must be either "monthly" or "yearly"',
      });
      return;
    }
  }

  // Validate date format if provided
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (start_date !== undefined && !dateRegex.test(start_date)) {
    res.status(400).json({
      success: false,
      message: 'Start date must be in YYYY-MM-DD format',
    });
    return;
  }

  if (end_date !== undefined && !dateRegex.test(end_date)) {
    res.status(400).json({
      success: false,
      message: 'End date must be in YYYY-MM-DD format',
    });
    return;
  }

  // Validate date logic if both dates are provided
  if (start_date !== undefined && end_date !== undefined) {
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);

    if (endDateObj <= startDateObj) {
      res.status(400).json({
        success: false,
        message: 'End date must be after start date',
      });
      return;
    }
  }

  next();
};