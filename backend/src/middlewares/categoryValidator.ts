import { Request, Response, NextFunction } from 'express';

export const validateCreateCategory = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, type } = req.body;

  // Check required fields
  if (!name || !type) {
    res.status(400).json({
      success: false,
      message: 'Name and type are required',
    });
    return;
  }

  // Validate name
  if (typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long',
    });
    return;
  }

  if (name.trim().length > 100) {
    res.status(400).json({
      success: false,
      message: 'Name must not exceed 100 characters',
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

  // Validate color if provided
  if (req.body.color !== undefined) {
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!colorRegex.test(req.body.color)) {
      res.status(400).json({
        success: false,
        message: 'Color must be a valid hex color (e.g., #FF5733)',
      });
      return;
    }
  }

  // Validate icon if provided
  if (req.body.icon !== undefined && req.body.icon !== null) {
    if (typeof req.body.icon !== 'string' || req.body.icon.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Icon must be a non-empty string',
      });
      return;
    }
  }

  next();
};

export const validateUpdateCategory = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, type, color, icon } = req.body;

  // At least one field must be provided
  if (name === undefined && type === undefined && color === undefined && icon === undefined) {
    res.status(400).json({
      success: false,
      message: 'At least one field must be provided for update',
    });
    return;
  }

  // Validate name if provided
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long',
      });
      return;
    }

    if (name.trim().length > 100) {
      res.status(400).json({
        success: false,
        message: 'Name must not exceed 100 characters',
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

  // Validate color if provided
  if (color !== undefined) {
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!colorRegex.test(color)) {
      res.status(400).json({
        success: false,
        message: 'Color must be a valid hex color (e.g., #FF5733)',
      });
      return;
    }
  }

  // Validate icon if provided
  if (icon !== undefined && icon !== null) {
    if (typeof icon !== 'string' || icon.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Icon must be a non-empty string',
      });
      return;
    }
  }

  next();
};