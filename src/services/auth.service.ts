import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Database } from 'sqlite';
import { db, connectToDatabase } from '../utils/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION = '1h';

export class AuthService {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  static async init() {
    const database = await connectToDatabase();
    return new AuthService(database);
  }

  async register(email: string, password: string, fullName?: string) {
    const passwordHash = await hash(password, 10);
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    await this.db.run(
      `INSERT INTO users (id, email, password_hash, full_name, created_at) VALUES (?, ?, ?, ?, ?)`,
      [id, email, passwordHash, fullName || null, createdAt]
    );
    return { id, email, full_name: fullName, created_at: createdAt };
  }

  async login(email: string, password: string) {
    const user = await this.db.get(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    if (!user || !(await compare(password, user.password_hash))) {
      throw new Error('Invalid credentials');
    }
    const token = sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    return { user, token };
  }

  async logout(token: string) {
    // Có thể lưu token vào blacklist nếu muốn
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(userId: string) {
    const user = await this.db.get(
      `SELECT * FROM users WHERE id = ?`,
      [userId]
    );
    return user;
  }

  async refreshToken(token: string) {
    try {
      const decoded = verify(token, JWT_SECRET) as { id: string };
      const user = await this.getCurrentUser(decoded.id);
      if (!user) throw new Error('User not found');
      const newToken = sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
      return { user, token: newToken };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}