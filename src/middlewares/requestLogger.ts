import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    // Bỏ qua logging cho các endpoint health check
    if (req.path === '/api/health') {
        return next();
    }

    const start = Date.now();
    const { method, originalUrl, body, query, params, user } = req;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;
        
        const logData = {
            method,
            url: originalUrl,
            status: statusCode,
            duration: `${duration}ms`,
            query,
            params,
            userId: user?.id || 'anonymous',
            userAgent: req.get('user-agent')
        };

        if (statusCode >= 500) {
            logger.error('Server Error', logData);
        } else if (statusCode >= 400) {
            logger.warn('Client Error', logData);
        } else {
            logger.info('Request Completed', logData);
        }
    });

    next();
};