import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService.js';

export const createTransaction = async (
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

    const transaction = await transactionService.createTransaction(userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      message: 'Failed to create transaction',
      error: err.message,
    });
  }
};

export const getTransactions = async (
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

    // Extract filters from query params
    const filters = {
      type: req.query.type as 'income' | 'expense' | undefined,
      category_id: req.query.category_id
        ? parseInt(req.query.category_id as string)
        : undefined,
      start_date: req.query.start_date as string | undefined,
      end_date: req.query.end_date as string | undefined,
      min_amount: req.query.min_amount
        ? parseFloat(req.query.min_amount as string)
        : undefined,
      max_amount: req.query.max_amount
        ? parseFloat(req.query.max_amount as string)
        : undefined,
    };

    const transactions = await transactionService.getTransactions(
      userId,
      filters
    );

    res.status(200).json({
      success: true,
      data: transactions,
      count: transactions.length,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions',
      error: err.message,
    });
  }
};

export const getTransactionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const transactionId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const transaction = await transactionService.getTransactionById(
      userId,
      transactionId
    );

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    const err = error as Error;
    
    if (err.message === 'Transaction not found') {
      res.status(404).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to get transaction',
      error: err.message,
    });
  }
};

export const updateTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const transactionId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const transaction = await transactionService.updateTransaction(
      userId,
      transactionId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction,
    });
  } catch (error) {
    const err = error as Error;
    
    if (err.message === 'Transaction not found') {
      res.status(404).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Failed to update transaction',
      error: err.message,
    });
  }
};

export const deleteTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const transactionId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    await transactionService.deleteTransaction(userId, transactionId);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    const err = error as Error;
    
    if (err.message === 'Transaction not found') {
      res.status(404).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction',
      error: err.message,
    });
  }
};

export const getTransactionStats = async (
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

    const stats = await transactionService.getTransactionStats(userId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction stats',
      error: err.message,
    });
  }
};