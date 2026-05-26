// Temporary workaround for missing Express type declarations
declare module 'express';
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database';
import authRoutes from './routes/authRoutes';
import courtsRoutes from './routes/courtsRoutes';
import bookingsRoutes from './routes/bookingsRoutes';
import teamsRoutes from './routes/teamsRoutes';
import offersRoutes from './routes/offersRoutes';
import favoritesRoutes from './routes/favoritesRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/favorites', favoritesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Futsal Mate Backend is running' });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Futsal Mate Backend running on http://localhost:${PORT}`);
  console.log(`📚 API documentation: Check the routes in src/routes/`);
});

export default app;
