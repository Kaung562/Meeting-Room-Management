import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Room } from '../entities/Room';

export async function getRooms(req: Request, res: Response): Promise<void> {
  const repo = AppDataSource.getRepository(Room);
  const rooms = await repo.find({ order: { id: 'ASC' } });
  res.json({ rooms });
}
