import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { connectToDatabase } from '../utils/db';

declare global {
    namespace Express {
        interface Request {
            user?: { id: string } | undefined;
        }
    }
}

let authService: AuthService;
connectToDatabase().then((db) => {
    authService = new AuthService(db);
});

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName } = req.body;
        const user = await authService.register(email, password, fullName);
        res.status(201).json(user);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(400).json({ message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(401).json({ message });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        await authService.logout(req.user?.id || '');
        res.status(204).send();
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(400).json({ message });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await authService.getCurrentUser(req.user?.id || '');
        res.status(200).json(user);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(400).json({ message });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const result = await authService.refreshToken(token);
        res.status(200).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(401).json({ message });
    }
};