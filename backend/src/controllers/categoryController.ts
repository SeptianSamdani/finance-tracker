import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService.js';

export const createCategory = async (
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

    const category = await categoryService.createCategory(userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    const err = error as Error;
    
    if (err.message === 'Category with this name and type already exists') {
      res.status(409).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Failed to create category',
      error: err.message,
    });
  }
};

export const getCategories = async (
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

    const type = req.query.type as 'income' | 'expense' | undefined;
    const categories = await categoryService.getCategories(userId, type);

    res.status(200).json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: err.message,
    });
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const categoryId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const category = await categoryService.getCategoryById(userId, categoryId);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    const err = error as Error;
    
    if (err.message === 'Category not found') {
      res.status(404).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to get category',
      error: err.message,
    });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const categoryId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const category = await categoryService.updateCategory(
      userId,
      categoryId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    const err = error as Error;
    
    if (err.message === 'Category not found') {
      res.status(404).json({
        success: false,
        message: err.message,
      });
      return;
    }

    if (err.message === 'Category with this name and type already exists') {
      res.status(409).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Failed to update category',
      error: err.message,
    });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const categoryId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    await categoryService.deleteCategory(userId, categoryId);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    const err = error as Error;
    
    if (err.message === 'Category not found') {
      res.status(404).json({
        success: false,
        message: err.message,
      });
      return;
    }

    if (err.message.includes('Cannot delete category')) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: err.message,
    });
  }
};

export const getCategoryStats = async (
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

    const stats = await categoryService.getCategoryStats(userId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to get category stats',
      error: err.message,
    });
  }
};