import { Request, Response } from 'express';
import * as summaryService from '../services/summaryService';

export async function getSummary(req: Request, res: Response): Promise<void> {
  const summary = await summaryService.getUsageSummary();
  res.json({ summary });
}
