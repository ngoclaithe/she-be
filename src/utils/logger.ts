import winston from 'winston';

const { combine, timestamp, printf, colorize, align } = winston.format;

// Định dạng log
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let log = `${timestamp} [${level.toUpperCase()}] ${message}`;
    
    if (Object.keys(metadata).length > 0) {
        log += `\n${JSON.stringify(metadata, null, 2)}`;
    }
    
    return log;
});

// Tạo logger đơn giản chỉ in ra console
const logger = winston.createLogger({
    level: 'debug', // Luôn hiển thị tất cả log
    format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        align(),
        logFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});

export default logger;