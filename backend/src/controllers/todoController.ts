import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
//todoController.ts
// 1. CREATE A NEW TODO WITH PRIORITY
export const createTodo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, priority } = req.body;
    const userId = req.user?.userId;

    if (!title || !String(title).trim()) {
      res.status(400).json({ error: 'Todo title is required' });
      return;
    }

    const todo = await prisma.todo.create({
      data: {
        title: String(title),
        description: description ? String(description) : null,
        priority: priority || 'MEDIUM', // Default to MEDIUM if not provided
        userId: String(userId),
      },
    });
    res.status(201).json({ message: 'Todo created!', todo });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

// 2. GET TODOS WITH SEARCH AND FILTERING
// GET TODOS WITH PAGINATION, SEARCH, AND FILTERING
export const getTodos = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { search, isCompleted, priority, page = '1', limit = '10' } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const todos = await prisma.todo.findMany({
      where: {
        userId: String(userId),
        title: { contains: search ? String(search) : '', mode: 'insensitive' },
        isCompleted: isCompleted !== undefined ? isCompleted === 'true' : undefined,
        priority: priority ? (priority as any) : undefined,
      },
      skip,
      take: limitNumber,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

// 3. UPDATE A TODO
export const updateTodo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted, priority } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Explicitly pass id mapping for Prisma
    const existingTodo = await prisma.todo.findUnique({ 
      where: { id: String(id) } 
    });

    if (!existingTodo || existingTodo.userId !== userId) {
      res.status(404).json({ error: 'Todo not found or unauthorized' });
      return;
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: String(id) },
      data: {
        title: title !== undefined ? String(title) : existingTodo.title,
        description: description !== undefined ? String(description) : existingTodo.description,
        isCompleted: isCompleted !== undefined ? Boolean(isCompleted) : existingTodo.isCompleted,
        priority: priority !== undefined ? priority : existingTodo.priority,
      },
    });

    res.status(200).json({ message: 'Todo updated successfully!', updatedTodo });
  } catch (error) {
    console.error('Update Todo Error:', error);
    res.status(500).json({ error: 'Internal server error while updating todo' });
  }
};

// 4. DELETE A TODO
export const deleteTodo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const existingTodo = await prisma.todo.findUnique({ 
      where: { id: String(id) } 
    });

    if (!existingTodo || existingTodo.userId !== userId) {
      res.status(404).json({ error: 'Todo not found or unauthorized' });
      return;
    }

    await prisma.todo.delete({ 
      where: { id: String(id) } 
    });

    res.status(200).json({ message: 'Todo deleted successfully!' });
  } catch (error) {
    console.error('Delete Todo Error:', error);
    res.status(500).json({ error: 'Internal server error while deleting todo' });
  }
};
