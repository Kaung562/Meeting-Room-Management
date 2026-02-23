import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';
declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function requireRole(...allowedRoles: string[]): (req: Request, res: Response, next: NextFunction) => void;
