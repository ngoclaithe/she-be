"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const savingsGoal_routes_1 = __importDefault(require("./routes/savingsGoal.routes"));
const budget_routes_1 = __importDefault(require("./routes/budget.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const db_1 = require("./utils/db");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '5000', 10);
// CORS Configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
// Health check endpoint - luôn hoạt động ngay cả khi database chưa kết nối
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});
// Middleware để kiểm tra database connection
let isDatabaseConnected = false;
const checkDatabaseConnection = (req, res, next) => {
    if (!isDatabaseConnected && !req.path.includes('/health')) {
        return res.status(503).json({
            error: 'Database not connected yet. Please try again later.',
            status: 'Service Unavailable'
        });
    }
    next();
};
// Routes - setup trước khi apply middleware
app.use('/api/auth', auth_routes_1.default);
app.use('/api/transactions', transaction_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/savings-goals', savingsGoal_routes_1.default);
app.use('/api/budgets', budget_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check available at: http://0.0.0.0:${PORT}/health`);
});
// Kết nối database bất đồng bộ
(0, db_1.connectToDatabase)()
    .then(() => {
    isDatabaseConnected = true;
    console.log('Database connected successfully');
})
    .catch((err) => {
    console.error('Database connection failed:', err);
    console.log('Server will continue running but API endpoints will return 503');
    // Thử kết nối lại sau 30 giây
    setTimeout(() => {
        console.log('Attempting to reconnect to database...');
        (0, db_1.connectToDatabase)()
            .then(() => {
            isDatabaseConnected = true;
            console.log('Database reconnected successfully');
        })
            .catch((retryErr) => {
            console.error('Database reconnection failed:', retryErr);
        });
    }, 30000);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
exports.default = app;
