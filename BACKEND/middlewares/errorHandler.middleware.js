import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js'; // Import the logger

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || 'Internal Server Error';
    err.statusCode = err.statusCode || 500;

    // Log the error details
    logger.error(`Error: ${err.message} | Status Code: ${err.statusCode} | Path: ${req.originalUrl}`);

    if (err.statusCode === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ApiError(400, message);
        logger.warn(`Duplicate Key Error: ${message}`);
    }

    if (err.name === 'JsonWebTokenError') {
        const message = `JSON Web Token is invalid. Try again.`;
        err = new ApiError(400, message);
        logger.warn(`JWT Error: ${message}`);
    }

    if (err.name === 'TokenExpiredError') {
        const message = `JSON Web Token has expired. Try again.`;
        err = new ApiError(400, message);
        logger.warn(`JWT Expired Error: ${message}`);
    }

    if (err.name === 'CastError') {
        const message = `Invalid ${err.path}`;
        err = new ApiError(message, 400);
        logger.warn(`Cast Error: ${message}`);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        err = new ApiError(400, message);
        logger.warn(`Validation Error: ${message}`);
    }

    const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;

    // Log the final error response
    logger.error(`Response Sent: Status Code: ${statusCode} | Message: ${err.message}`);

    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};