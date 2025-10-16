import express from 'express';
import * as authController from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middlewares/validator.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);

export default router;