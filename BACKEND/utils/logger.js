import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

// Define the log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Create the logger instance
export const logger = createLogger({
    level: 'info', // Default log level
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(), // Adds color to log levels
        logFormat
    ),
    transports: [
        new transports.Console(), // Logs to the console
        new transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs errors to a file
        new transports.File({ filename: 'logs/combined.log' }) // Logs all levels to a file
    ],
});

// Export the logger
