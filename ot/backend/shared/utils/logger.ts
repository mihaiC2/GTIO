import winston from 'winston';
import path from 'path';
import { Request } from 'express';

const customFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
);

const logger = winston.createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        //new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/combined.log')
        })
    ]
});

export const logRequest = (req: Request, message: string, type: 'info' | 'error' = 'info') => {
    const logMessage = `[${req.method}] ${req.originalUrl} - ${message}`;
    if (type === 'info') {
        logger.info(logMessage);
    } else if (type === 'error') {
        logger.error(logMessage);
    }
};