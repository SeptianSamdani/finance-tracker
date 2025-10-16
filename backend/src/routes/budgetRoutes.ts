import express from 'express';
import * as budgetController from '../controllers/budgetController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  validateCreateBudget,
  validateUpdateBudget,
} from '../middlewares/budgetValidator.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Get budget summary
router.get('/summary', budgetController.getBudgetSummary);

// CRUD operations
router.post('/', validateCreateBudget, budgetController.createBudget);
router.get('/', budgetController.getBudgets);
router.get('/:id', budgetController.getBudgetById);
router.put('/:id', validateUpdateBudget, budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

export default router;