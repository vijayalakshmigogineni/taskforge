import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
//authMiddleware.ts
// Define a custom interface that extends the standard Express Request 
// so TypeScript knows it's perfectly safe to attach user data to it.
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  // 1. Extract the Authorization header (Format sent by clients: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // 2. If no token is provided, block them immediately
  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  try {
    // 3. Verify the token using your environment secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as {
      userId: string;
      email: string;
    };

    // 4. Attach the decoded user payload directly to the request object
    req.user = decoded;
    
    // 5. Everything checks out! Move along to the actual controller
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};