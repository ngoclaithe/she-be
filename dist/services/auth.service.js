"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
const db_1 = require("../utils/db");
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION = '1h';
class AuthService {
    constructor(database) {
        this.db = database;
    }
    static async init() {
        const database = await (0, db_1.connectToDatabase)();
        return new AuthService(database);
    }
    async register(email, password, fullName) {
        const passwordHash = await (0, bcrypt_1.hash)(password, 10);
        const id = (0, uuid_1.v4)();
        const createdAt = new Date().toISOString();
        await this.db.run(`INSERT INTO users (id, email, password_hash, full_name, created_at) VALUES (?, ?, ?, ?, ?)`, [id, email, passwordHash, fullName || null, createdAt]);
        return { id, email, full_name: fullName, created_at: createdAt };
    }
    async login(email, password) {
        const user = await this.db.get(`SELECT * FROM users WHERE email = ?`, [email]);
        if (!user || !(await (0, bcrypt_1.compare)(password, user.password_hash))) {
            throw new Error('Invalid credentials');
        }
        const token = (0, jsonwebtoken_1.sign)({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        return { user, token };
    }
    async logout(token) {
        // Có thể lưu token vào blacklist nếu muốn
        return { message: 'Logged out successfully' };
    }
    async getCurrentUser(userId) {
        const user = await this.db.get(`SELECT * FROM users WHERE id = ?`, [userId]);
        return user;
    }
    async refreshToken(token) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
            const user = await this.getCurrentUser(decoded.id);
            if (!user)
                throw new Error('User not found');
            const newToken = (0, jsonwebtoken_1.sign)({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
            return { user, token: newToken };
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
}
exports.AuthService = AuthService;
