import { Request, Response, NextFunction } from 'express';
type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare function asyncHandler(fn: AsyncRouteHandler): (req: Request, res: Response, next: NextFunction) => void;
export {};
