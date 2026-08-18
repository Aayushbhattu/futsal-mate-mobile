import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes';
import bookingsRoutes from './routes/bookingsRoutes';
import courtsRoutes from './routes/courtsRoutes';
import favoritesRoutes from './routes/favoritesRoutes';
import offersRoutes from './routes/offersRoutes';
import teamsRoutes from './routes/teamsRoutes';
import { initializeDatabase } from './database';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

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
  console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
  console.log(`✅ Health Check: http://localhost:${PORT}/health`);
});

export default app;
