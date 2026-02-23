import { Request, Response, NextFunction } from 'express';
import { ResponseError } from '../errorHandlers/ResponseError';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ResponseError) {
    const body: Record<string, unknown> = { error: err.message };
    if (err.details !== undefined) body.details = err.details;
    res.status(err.statusCode).json(body);
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
