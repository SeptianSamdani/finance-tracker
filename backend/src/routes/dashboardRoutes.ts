import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Get complete dashboard (all data in one request)
router.get('/', dashboardController.getCompleteDashboard);

// Individual endpoints
router.get('/summary', dashboardController.getOverallSummary);
router.get('/monthly', dashboardController.getMonthlySummary);
router.get('/categories', dashboardController.getCategoryBreakdown);
router.get('/recent', dashboardController.getRecentTransactions);

export default router;