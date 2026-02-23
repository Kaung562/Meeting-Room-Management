import { Request, Response } from 'express';
export declare function getMe(req: Request, res: Response): Promise<void>;
export declare function getUsers(req: Request, res: Response): Promise<void>;
export declare function createUser(req: Request, res: Response): Promise<void>;
export declare function updateUserRole(req: Request, res: Response): Promise<void>;
export declare function deleteUser(req: Request, res: Response): Promise<void>;
