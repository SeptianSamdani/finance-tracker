import { Request, Response } from 'express';
import * as dashboardService from '../services/dashboardService.js';

export const getOverallSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const summary = await dashboardService.getOverallSummary(userId);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to get summary',
      error: err.message,
    });
  }
};

export const getMonthlySummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const monthly = await dashboardService.getMonthlySummary(userId);

    res.status(200).json({
      success: true,
      data: monthly,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to get monthly summary',
      error: err.message,
    });
  }
};

export const getCategoryBreakdown = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const categories = await dashboardService.getCategoryBreakdown(userId);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to get category breakdown',
      error: err.message,
    });
  }
};

export const getRecentTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const recent = await dashboardService.getRecentTransactions(userId);

    res.status(200).json({
      success: true,
      data: recent,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to get recent transactions',
      error: err.message,
    });
  }
};

export const getCompleteDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const dashboard = await dashboardService.getCompleteDashboard(userId);

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard',
      error: err.message,
    });
  }
};