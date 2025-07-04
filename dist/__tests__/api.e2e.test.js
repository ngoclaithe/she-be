"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Nếu app export mặc định, nếu không thì export app ở cuối app.ts
let token = '';
describe('API Integration', () => {
    it('Register user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: '123456', fullName: 'Test User' });
        expect(res.status).toBe(201);
        expect(res.body.email).toBe('test@example.com');
    });
    it('Login user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: '123456' });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        token = res.body.token;
    });
    it('Get current user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.email).toBe('test@example.com');
    });
    it('Create category', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Food', type: 'expense' });
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Food');
    });
    // Thêm các test cho transaction, savingsGoal, budget, report tương tự
});
