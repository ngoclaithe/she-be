import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import categoryRoutes from './routes/category.routes';
import savingsGoalRoutes from './routes/savingsGoal.routes';
import savingsRoutes from './routes/savings.routes';
import budgetRoutes from './routes/budget.routes';
import reportRoutes from './routes/report.routes';
import { connectToDatabase } from './utils/db';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { requestLogger } from './middlewares/requestLogger';
import logger from './utils/logger';

const app = express();

// Middleware cơ bản
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.FRONTEND_URL || '*')  // Cho phép tất cả trong production nếu không có FRONTEND_URL
    : (process.env.FRONTEND_URL || 'http://localhost:3000'),  // Mặc định cho môi trường development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Log CORS configuration
console.log(`CORS configured with origin: ${corsOptions.origin}`);

// Middleware logging
app.use(requestLogger);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Kết nối database
connectToDatabase()
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });

// Các routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/savings-goals', savingsGoalRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Xử lý 404
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Not Found',
        error: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Xử lý lỗi toàn cục
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error('Unhandled error', {
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.originalUrl,
        method: req.method
    });
    
    const statusCode = parseInt(err.statusCode, 10) || 500;
    
    res.status(statusCode).json({ 
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong' 
            : err.message
    });
});

// Khởi động server
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check available at: http://0.0.0.0:${PORT}/api/health`);
});

// Xử lý tín hiệu dừng ứng dụng
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });

    // Nếu server không đóng sau 5s, thoát ngay
    setTimeout(() => {
        console.error('Forcing shutdown...');
        process.exit(1);
    }, 5000);
});

export default app;