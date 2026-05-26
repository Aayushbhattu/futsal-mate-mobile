const express = require('express');
const cors = require('cors');
const { readDB, writeDB } = require('./db');
const { generateToken, verifyToken, hashPassword, comparePassword } = require('./auth');

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.userId = decoded.userId;
  req.email = decoded.email;
  next();
}

// ==================== AUTH ENDPOINTS ====================

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = readDB();
    const userExists = db.users.find(u => u.email === email);

    if (userExists) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const userId = Math.max(0, ...db.users.map(u => u.id), 0) + 1;

    const newUser = {
      id: userId,
      email,
      password: hashedPassword,
      full_name,
      phone: phone || null,
      created_at: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    const token = generateToken(userId, email);
    const { password: _, ...userWithoutPassword } = newUser;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const db = readDB();
    const user = db.users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.email);
    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    const user = db.users.find(u => u.id === req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== COURTS ENDPOINTS ====================

app.get('/api/courts', (req, res) => {
  try {
    const db = readDB();
    res.json(db.courts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/courts/:id', (req, res) => {
  try {
    const db = readDB();
    const court = db.courts.find(c => c.id === parseInt(req.params.id));

    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }

    res.json(court);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== BOOKINGS ENDPOINTS ====================

app.get('/api/bookings', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    const userBookings = db.bookings.filter(b => b.user_id === req.userId);
    
    const bookingsWithCourts = userBookings.map(booking => {
      const court = db.courts.find(c => c.id === booking.court_id);
      return {
        ...booking,
        court_name: court?.name || 'Unknown Court'
      };
    });

    res.json(bookingsWithCourts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', authMiddleware, (req, res) => {
  try {
    const { court_id, booking_date, start_time, end_time, total_price } = req.body;

    if (!court_id || !booking_date || !start_time || !end_time || !total_price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = readDB();
    const bookingId = Math.max(0, ...db.bookings.map(b => b.id), 0) + 1;

    const newBooking = {
      id: bookingId,
      user_id: req.userId,
      court_id,
      booking_date,
      start_time,
      end_time,
      total_price,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };

    db.bookings.push(newBooking);
    writeDB(db);

    res.json(newBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/bookings/:id', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    const booking = db.bookings.find(b => b.id === parseInt(req.params.id) && b.user_id === req.userId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    db.bookings = db.bookings.filter(b => b.id !== parseInt(req.params.id));
    writeDB(db);

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== TEAMS ENDPOINTS ====================

app.get('/api/teams', (req, res) => {
  try {
    const db = readDB();
    res.json(db.teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/teams/:id/join', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    const team = db.teams.find(t => t.id === parseInt(req.params.id));

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Simple join (no duplicate checking for now)
    if (!team.members) {
      team.members = [];
    }
    
    if (!team.members.includes(req.userId)) {
      team.members.push(req.userId);
      team.member_count = team.members.length;
      writeDB(db);
    }

    res.json({ message: 'Joined team successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== OFFERS ENDPOINTS ====================

app.get('/api/offers', (req, res) => {
  try {
    const db = readDB();
    const today = new Date().toISOString().split('T')[0];
    
    const activeOffers = db.offers.filter(o => {
      const court = db.courts.find(c => c.id === o.court_id);
      return o.valid_to >= today && court;
    }).map(o => {
      const court = db.courts.find(c => c.id === o.court_id);
      return {
        ...o,
        court_name: court?.name || 'Unknown Court'
      };
    });

    res.json(activeOffers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== FAVORITES ENDPOINTS ====================

app.get('/api/favorites', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    const userFavorites = db.favorites.filter(f => f.user_id === req.userId);

    const favoritesWithCourts = userFavorites.map(fav => {
      const court = db.courts.find(c => c.id === fav.court_id);
      return {
        id: fav.id,
        court_id: fav.court_id,
        ...court
      };
    });

    res.json(favoritesWithCourts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/favorites', authMiddleware, (req, res) => {
  try {
    const { court_id } = req.body;

    if (!court_id) {
      return res.status(400).json({ error: 'Missing court_id' });
    }

    const db = readDB();
    const exists = db.favorites.find(f => f.user_id === req.userId && f.court_id === court_id);

    if (exists) {
      return res.status(409).json({ error: 'Already in favorites' });
    }

    const favId = Math.max(0, ...db.favorites.map(f => f.id), 0) + 1;
    const newFavorite = {
      id: favId,
      user_id: req.userId,
      court_id
    };

    db.favorites.push(newFavorite);
    writeDB(db);

    res.json(newFavorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/favorites/:court_id', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    const favorite = db.favorites.find(f => f.user_id === req.userId && f.court_id === parseInt(req.params.court_id));

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    db.favorites = db.favorites.filter(f => !(f.user_id === req.userId && f.court_id === parseInt(req.params.court_id)));
    writeDB(db);

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Futsal Mate Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Futsal Mate Backend running on http://localhost:${PORT}`);
  console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
  console.log(`✅ Health Check: http://localhost:${PORT}/health`);
});
