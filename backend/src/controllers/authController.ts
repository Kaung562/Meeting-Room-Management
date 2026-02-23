import { Request, Response } from 'express';
import { verifyLogin } from '../services/userService';

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;
  const user = await verifyLogin(username ?? '', password ?? '');
  res.json({ user: { id: user.id, username: user.username, name: user.name, role: user.role } });
}
