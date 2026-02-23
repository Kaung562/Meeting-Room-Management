import { Request, Response } from 'express';
import * as userService from '../services/userService';

export async function getMe(req: Request, res: Response): Promise<void> {
  res.json({ user: req.currentUser });
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  const users = await userService.getUsers();
  res.json({ users: users.map((u) => ({ id: u.id, username: u.username, name: u.name, role: u.role })) });
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const { username, password, name, role } = req.body;
  const user = await userService.createUser({ username, password, name, role });
  res.status(201).json({ user: { id: user.id, username: user.username, name: user.name, role: user.role } });
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid user id' });
    return;
  }
  const { role } = req.body;
  const user = await userService.updateUserRole(id, role);
  res.json({ user: { id: user.id, username: user.username, name: user.name, role: user.role } });
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid user id' });
    return;
  }
  await userService.deleteUser(id, req.currentUser!.id);
  res.status(204).send();
}
