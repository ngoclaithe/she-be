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
const savings_routes_1 = __importDefault(require("./routes/savings.routes"));
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
app.get('/api/health', (req, res) => {
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
// API Routes
const apiRouter = express_1.default.Router();
apiRouter.use('/auth', auth_routes_1.default);
apiRouter.use('/transactions', transaction_routes_1.default);
apiRouter.use('/categories', category_routes_1.default);
apiRouter.use('/savings-goals', savingsGoal_routes_1.default);
apiRouter.use('/savings', savings_routes_1.default);
apiRouter.use('/budgets', budget_routes_1.default);
apiRouter.use('/reports', report_routes_1.default);
// Mount API router with /api prefix
app.use('/api', apiRouter);
// Swagger documentation - Đặt sau khi đã mount /api router
app.use('/api/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// 404 Handler - Phải đặt sau tất cả các routes khác
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Not Found',
        error: `Cannot ${req.method} ${req.originalUrl}`
    });
});
// Global error handler - Phải đặt sau tất cả các routes nhưng trước 404 handler
const errorHandler = (err, req, res, next) => {
    console.error('Global error handler:', err);
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
            error: 'Invalid or expired token'
        });
        return;
    }
    // Handle validation errors
    if (err.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: err.message
        });
        return;
    }
    // Handle other errors
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
app.use(errorHandler);
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
