import { Router } from 'express';
import { register, login,resetPassword } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

//authRoutes.ts 
const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// Add this line to your router
router.post('/reset-password', authenticateToken, resetPassword);

export default router;