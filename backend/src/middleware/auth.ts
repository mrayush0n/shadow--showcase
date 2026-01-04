import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                uid: string;
                email?: string;
                emailVerified?: boolean;
            };
        }
    }
}

/**
 * Authentication middleware that verifies Firebase ID tokens
 * Expects Authorization header: Bearer <firebase-id-token>
 */
export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Authorization header missing or invalid' });
            return;
        }

        const idToken = authHeader.split('Bearer ')[1];

        if (!auth) {
            // Firebase not configured - allow requests in development
            console.warn('⚠️ Firebase Auth not configured, skipping token verification');
            req.user = { uid: 'dev-user', email: 'dev@example.com' };
            next();
            return;
        }

        const decodedToken = await auth.verifyIdToken(idToken);

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified,
        };

        next();
    } catch (error: any) {
        console.error('Auth error:', error.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

/**
 * Optional auth middleware - doesn't fail if no token present
 */
export const optionalAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ') && auth) {
            const idToken = authHeader.split('Bearer ')[1];
            const decodedToken = await auth.verifyIdToken(idToken);
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                emailVerified: decodedToken.email_verified,
            };
        }

        next();
    } catch (error) {
        // Silently continue without user
        next();
    }
};
