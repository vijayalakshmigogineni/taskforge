// src/routes/todoRoutes.ts

import { Router } from 'express';
import * as todoController from '../controllers/todoController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Debug check
console.log('DEBUG CHECK:', {
  createTodo: typeof todoController.createTodo,
  getTodos: typeof todoController.getTodos,
  updateTodo: typeof todoController.updateTodo,
  deleteTodo: typeof todoController.deleteTodo,
  authenticateToken: typeof authenticateToken
});

// CREATE TODO
router.post(
  '/',
  authenticateToken,
  todoController.createTodo
);

// GET ALL TODOS
router.get(
  '/',
  authenticateToken,
  todoController.getTodos
);

// UPDATE TODO
router.put(
  '/:id',
  authenticateToken,
  todoController.updateTodo
);

// DELETE TODO
router.delete(
  '/:id',
  authenticateToken,
  todoController.deleteTodo
);

export default router;