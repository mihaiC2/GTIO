import winston from 'winston';
import path from 'path';
import { Request } from 'express';

import { MongoDB } from 'winston-mongodb';

const customFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
);

const logger = winston.createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/combined.log')
        }),
        new MongoDB({
            db: process.env.MONGODB_URL as string,
            collection: 'winston_logs',
            options: { useUnifiedTopology: true },
            level: 'info',
            tryReconnect: true,
            format: winston.format.metadata()
        })
    ]
});

export const logRequest = (req: Request, message: string, type: 'info' | 'error' = 'info') => {
    const logMessage = `[${req.method}] ${req.originalUrl} - ${message}`;
    logger.log({
        level: type,
        message: logMessage,
        metadata: {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            body: req.body
        }
    });
};

export default logger;