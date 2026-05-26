import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Courts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS courts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      price_per_hour REAL NOT NULL,
      rating REAL DEFAULT 4.5,
      image_url TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      court_id INTEGER NOT NULL,
      booking_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      total_price REAL NOT NULL,
      status TEXT DEFAULT 'confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (court_id) REFERENCES courts(id)
    )
  `);

  // Teams table
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      location TEXT,
      member_count INTEGER DEFAULT 1,
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Team members table
  db.exec(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (team_id) REFERENCES teams(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(team_id, user_id)
    )
  `);

  // Offers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      court_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      discount_percentage REAL,
      valid_from DATE,
      valid_to DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (court_id) REFERENCES courts(id)
    )
  `);

  // Favorites table
  db.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      court_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (court_id) REFERENCES courts(id),
      UNIQUE(user_id, court_id)
    )
  `);

  seedDatabase();
}

function seedDatabase() {
  // Check if courts already exist
  const courtCount = db.prepare('SELECT COUNT(*) as count FROM courts').get() as any;
  
  if (courtCount.count === 0) {
    // Seed courts
    const courts = [
      {
        name: 'Downtown Futsal Arena',
        location: 'City Center, Downtown',
        price_per_hour: 50,
        rating: 4.8,
        image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
        description: 'Premium futsal court in the heart of the city'
      },
      {
        name: 'Sports Hub Complex',
        location: 'North District',
        price_per_hour: 40,
        rating: 4.5,
        image_url: 'https://images.unsplash.com/photo-1575361204480-aadea25bd85e?w=400',
        description: 'Modern facility with professional courts'
      },
      {
        name: 'Elite Futsal Club',
        location: 'South Park',
        price_per_hour: 60,
        rating: 4.9,
        image_url: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=400',
        description: 'Championship-standard futsal venue'
      },
      {
        name: 'Community Sports Center',
        location: 'Suburb Area',
        price_per_hour: 30,
        rating: 4.2,
        image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
        description: 'Budget-friendly community sports facility'
      },
      {
        name: 'Rainbow Stadium',
        location: 'East End',
        price_per_hour: 45,
        rating: 4.6,
        image_url: 'https://images.unsplash.com/photo-1540747913ee00fa4e050c14c1f600ca6f996f343?w=400',
        description: 'Multi-purpose sports facility with futsal courts'
      }
    ];

    courts.forEach(court => {
      db.prepare(`
        INSERT INTO courts (name, location, price_per_hour, rating, image_url, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(court.name, court.location, court.price_per_hour, court.rating, court.image_url, court.description);
    });

    // Seed offers
    db.prepare(`
      INSERT INTO offers (court_id, title, description, discount_percentage, valid_from, valid_to)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(1, 'Weekend Special', '20% off on bookings this weekend', 20, new Date().toISOString().split('T')[0], '2025-12-31');

    db.prepare(`
      INSERT INTO offers (court_id, title, description, discount_percentage, valid_from, valid_to)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(3, 'New Year Deal', '30% off for first-time bookings', 30, new Date().toISOString().split('T')[0], '2025-12-31');
  }
}

export default db;
