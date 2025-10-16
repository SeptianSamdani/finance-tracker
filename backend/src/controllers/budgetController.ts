import { Request, Response } from 'express';
import * as budgetService from '../services/budgetService.js';

export const createBudget = async (
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

    const budget = await budgetService.createBudget(userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: budget,
    });
  } catch (error) {
    const err = error as Error;
    
    if (err.message.includes('already exists') || err.message.includes('can only be set')) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Failed to create budget',
      error: err.message,
    });
  }
};

export const getBudgets = async (
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

    const period = req.query.period as 'monthly' | 'yearly' | undefined;
    const budgets = await budgetService.getBudgets(userId, period);

    res.status(200).json({
      success: true,
      data: budgets,
      count: budgets.length,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to get budgets',
      error: err.message,
    });
  }
};

export const getBudgetById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const budgetId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const budget = await budgetService.getBudgetById(userId, budgetId);

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    const err = error as Error;
    
    if (err.message === 'Budget not found') {
      res.status(404).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to get budget',
      error: err.message,
    });
  }
};

export const updateBudget = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const budgetId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const budget = await budgetService.updateBudget(
      userId,
      budgetId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: budget,
    });
  } catch (error) {
    const err = error as Error;
    
    if (err.message === 'Budget not found') {
      res.status(404).json({
        success: false,
        message: err.message,
      });
      return;
    }

    if (err.message.includes('already exists') || err.message.includes('can only be set')) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Failed to update budget',
      error: err.message,
    });
  }
};

export const deleteBudget = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const budgetId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    await budgetService.deleteBudget(userId, budgetId);

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    const err = error as Error;
    
    if (err.message === 'Budget not found') {
      res.status(404).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete budget',
      error: err.message,
    });
  }
};

export const getBudgetSummary = async (
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

    const summary = await budgetService.getBudgetSummary(userId);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to get budget summary',
      error: err.message,
    });
  }
};