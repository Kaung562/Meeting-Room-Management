import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../services/userService';
import { ResponseError } from '../errorHandlers/ResponseError';
import { AuthErrors } from '../constants/errors';
import { User } from '../entities/User';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const raw = req.headers['x-user-id'];
  if (raw === undefined || raw === null || raw === '') {
    next(new ResponseError(401, AuthErrors.MISSING_USER_ID));
    return;
  }
  const id = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
  if (Number.isNaN(id)) {
    next(new ResponseError(401, AuthErrors.USER_NOT_FOUND));
    return;
  }
  const user = await findUserById(id);
  if (!user) {
    next(new ResponseError(401, AuthErrors.USER_NOT_FOUND));
    return;
  }
  req.currentUser = user;
  next();
}

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.currentUser) {
      next(new ResponseError(401, AuthErrors.NOT_AUTHENTICATED));
      return;
    }
    if (!allowedRoles.includes(req.currentUser.role)) {
      next(new ResponseError(403, AuthErrors.INSUFFICIENT_PERMISSIONS));
      return;
    }
    next();
  };
}
