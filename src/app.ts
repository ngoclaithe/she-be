import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import categoryRoutes from './routes/category.routes';
import savingsGoalRoutes from './routes/savingsGoal.routes';
import budgetRoutes from './routes/budget.routes';
import reportRoutes from './routes/report.routes';
import { connectToDatabase } from './utils/db';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// CORS Configuration
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], // Allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

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

const checkDatabaseConnection = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!isDatabaseConnected && !req.path.includes('/health')) {
    return res.status(503).json({
      error: 'Database not connected yet. Please try again later.',
      status: 'Service Unavailable'
    });
  }
  next();
};

// Routes - setup trước khi apply middleware
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/savings-goals', savingsGoalRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server immediately
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});

// Kết nối database bất đồng bộ
connectToDatabase()
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
      connectToDatabase()
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

export default app;