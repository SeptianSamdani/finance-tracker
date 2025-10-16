import { Request, Response } from 'express';
import * as authService from '../services/authService.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    const err = error as Error;
    
    if (err.message === 'Email already registered') {
      res.status(409).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: err.message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    const err = error as Error;
    
    if (err.message === 'Invalid email or password') {
      res.status(401).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: err.message,
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const user = await authService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: err.message,
    });
  }
};