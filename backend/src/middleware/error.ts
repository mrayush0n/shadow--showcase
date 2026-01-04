import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 */
export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('❌ Error:', error.message);
    console.error(error.stack);

    // Handle specific error types
    if (error.name === 'ValidationError') {
        res.status(400).json({
            error: 'Validation Error',
            message: error.message,
        });
        return;
    }

    if (error.name === 'UnauthorizedError') {
        res.status(401).json({
            error: 'Unauthorized',
            message: error.message,
        });
        return;
    }

    // Default server error
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
