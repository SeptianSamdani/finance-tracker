import express from 'express';
import * as transactionController from '../controllers/transactionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  validateCreateTransaction,
  validateUpdateTransaction,
} from '../middlewares/transactionValidator.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Get transaction statistics
router.get('/stats', transactionController.getTransactionStats);

// CRUD operations
router.post('/', validateCreateTransaction, transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', validateUpdateTransaction, transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;