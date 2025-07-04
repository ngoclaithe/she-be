"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.getMe = exports.logout = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const db_1 = require("../utils/db");
let authService;
(0, db_1.connectToDatabase)().then((db) => {
    authService = new auth_service_1.AuthService(db);
});
const register = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        const user = await authService.register(email, password, fullName);
        res.status(201).json(user);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(400).json({ message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(401).json({ message });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        await authService.logout(req.user?.id || '');
        res.status(204).send();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(400).json({ message });
    }
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        const user = await authService.getCurrentUser(req.user?.id || '');
        res.status(200).json(user);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(400).json({ message });
    }
};
exports.getMe = getMe;
const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        const result = await authService.refreshToken(token);
        res.status(200).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(401).json({ message });
    }
};
exports.refreshToken = refreshToken;
