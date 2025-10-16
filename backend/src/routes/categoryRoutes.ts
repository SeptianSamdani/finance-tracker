import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  validateCreateCategory,
  validateUpdateCategory,
} from '../middlewares/categoryValidator.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Get category statistics
router.get('/stats', categoryController.getCategoryStats);

// CRUD operations
router.post('/', validateCreateCategory, categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', validateUpdateCategory, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;