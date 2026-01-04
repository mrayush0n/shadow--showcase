import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import aiRoutes from './routes/ai';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import featuresRoutes from './routes/features';

// Import middleware
import { errorHandler } from './middleware/error';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware (50MB limit for images/videos)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/features', featuresRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server only if run directly (local dev)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Shadow Showcase Backend running on port ${PORT}`);
        console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    });
}

export default app;
