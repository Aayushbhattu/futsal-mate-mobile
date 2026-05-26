# Futsal Mate Backend API

A complete REST API for the Futsal Mate mobile app built with Node.js, Express, and SQLite.

## Features

✅ **Authentication** - JWT-based user authentication with password hashing
✅ **Courts Management** - Browse and view futsal courts with ratings
✅ **Bookings** - Create, view, and cancel court bookings
✅ **Teams** - Create and join futsal teams
✅ **Offers** - View special discounts and promotions
✅ **Favorites** - Save favorite courts for quick access

## Setup Instructions

### Prerequisites
- Node.js 14+ and npm

### Installation

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The API will be running on `http://localhost:8081`

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current user info (requires token)

### Courts
- `GET /api/courts` - Get all courts
- `GET /api/courts/:id` - Get court details

### Bookings (Requires Authentication)
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create a new booking
- `DELETE /api/bookings/:id` - Cancel a booking

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams/:id/join` - Join a team (requires auth)

### Offers
- `GET /api/offers` - Get active offers

### Favorites (Requires Authentication)
- `GET /api/favorites` - Get user's favorite courts
- `POST /api/favorites` - Add a court to favorites
- `DELETE /api/favorites/:court_id` - Remove from favorites

## Example Requests

### Sign Up
```bash
curl -X POST http://localhost:8081/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "full_name": "John Doe",
    "phone": "1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

### Get All Courts
```bash
curl http://localhost:8081/api/courts
```

### Get User Info (with token)
```bash
curl http://localhost:8081/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database

The backend uses SQLite with the following tables:
- **users** - User accounts
- **courts** - Futsal courts information
- **bookings** - User bookings
- **teams** - Futsal teams
- **team_members** - Team membership
- **offers** - Special offers and discounts
- **favorites** - User favorite courts

The database is automatically created and seeded with sample data on first run.

## Environment Variables

Create a `.env` file in the backend folder:
```
PORT=8081
JWT_SECRET=your-secret-key-change-in-production
```

## Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Express app setup
│   ├── database.ts            # SQLite database and schema
│   ├── controllers/           # Business logic
│   │   ├── authController.ts
│   │   ├── courtsController.ts
│   │   ├── bookingsController.ts
│   │   ├── teamsController.ts
│   │   ├── offersController.ts
│   │   └── favoritesController.ts
│   ├── routes/                # API routes
│   │   ├── authRoutes.ts
│   │   ├── courtsRoutes.ts
│   │   ├── bookingsRoutes.ts
│   │   ├── teamsRoutes.ts
│   │   ├── offersRoutes.ts
│   │   └── favoritesRoutes.ts
│   └── middleware/            # Auth and error handling
│       ├── auth.ts
│       └── errorHandler.ts
├── database.sqlite            # SQLite database (auto-created)
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **better-sqlite3** - SQLite database driver
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin support

## Notes

- The API automatically seeds the database with sample courts and offers on first run
- All authenticated endpoints require a JWT token in the `Authorization: Bearer <token>` header
- Passwords are hashed using bcrypt before storage
- CORS is enabled to allow requests from the React Native frontend
