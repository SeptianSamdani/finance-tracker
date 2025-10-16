import { Request, Response, NextFunction } from 'express';

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password, full_name } = req.body;

  // Check if all fields are provided
  if (!email || !password || !full_name) {
    res.status(400).json({
      success: false,
      message: 'All fields are required (email, password, full_name)',
    });
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
    return;
  }

  // Validate password length
  if (password.length < 6) {
    res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
    return;
  }

  // Validate full name
  if (full_name.trim().length < 2) {
    res.status(400).json({
      success: false,
      message: 'Full name must be at least 2 characters long',
    });
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
    return;
  }

  next();
};