# Futsal Mate - Full Stack Application ⚽

A complete full-stack futsal booking and team management application with a React Native mobile frontend and Node.js Express backend.

## 📁 Project Structure

```
futsal-mate-mobile/
├── backend/              # Node.js + Express REST API
│   ├── index.js          # Main Express application
│   ├── db.js             # Database utilities
│   ├── auth.js           # JWT and auth utilities
│   ├── db.json           # JSON data storage
│   ├── package.json
│   └── README.md
│
├── frontend/             # React Native + Expo application
│   ├── app/
│   ├── src/              # Source code
│   ├── package.json
│   └── app.json
│
└── README.md             # This file
```

## 🚀 Quick Start

### 1. Start Backend

```bash
cd backend
npm install
npm start
```

Backend runs on: `http://localhost:8081`

### 2. Start Frontend

```bash
cd frontend
npm install
npm run web      # Web browser
# OR
npm run android  # Android emulator
npm run ios      # iOS simulator
```

## 🔌 API Endpoints

All API endpoints are prefixed with `/api`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create new account |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |
| GET | `/courts` | Get all courts |
| GET | `/courts/:id` | Get court details |
| GET | `/bookings` | Get user's bookings |
| POST | `/bookings` | Create booking |
| DELETE | `/bookings/:id` | Cancel booking |
| GET | `/teams` | Get all teams |
| POST | `/teams/:id/join` | Join team |
| GET | `/offers` | Get active offers |
| GET | `/favorites` | Get favorite courts |
| POST | `/favorites` | Add to favorites |
| DELETE | `/favorites/:court_id` | Remove from favorites |

## ✨ Features

✅ User authentication (JWT-based)
✅ Browse futsal courts with ratings
✅ Book courts for specific times
✅ Save favorite courts
✅ Browse and join teams
✅ View special offers
✅ Secure token storage
✅ Pull-to-refresh functionality

## 🧪 Quick API Test

```bash
# Get all courts
curl http://localhost:8081/api/courts

# Sign up
curl -X POST http://localhost:8081/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","full_name":"John"}'

# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

## 📚 Full Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native, Expo, TypeScript, Axios |
| Backend | Express.js, Node.js, JWT, bcryptjs |
| Database | JSON (development) |
| Storage | SecureStore (tokens), Context API (state) |

## 📝 Key Files

- `backend/index.js` - Main API server
- `frontend/src/services/api.ts` - API client configuration
- `frontend/src/context/AuthContext.tsx` - Authentication state
- `frontend/src/components/Home.tsx` - Main home screen

## 🔐 Authentication Flow

1. User signs up/logs in
2. Backend validates credentials and returns JWT token
3. Frontend stores token securely
4. Token sent in `Authorization: Bearer <token>` header for protected endpoints
5. Backend validates token for each request

## 📱 Sample Data

The backend comes pre-populated with:
- **5 Futsal Courts** with ratings and prices
- **2 Active Offers** with discounts
- **1 Sample Team** for browsing

## ⚙️ Configuration

### Backend
Create `backend/.env`:
```
PORT=8081
JWT_SECRET=your-secret-key-here
```

### Frontend
API URL is configured in `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8081/api';
```

For mobile devices, use your computer's IP address:
```typescript
const API_BASE_URL = 'http://192.168.x.x:8081/api';
```

## 🚨 Important Notes

- **JSON Database**: Used for development. Switch to PostgreSQL/MongoDB for production.
- **JWT Secret**: Change the default secret in production.
- **HTTPS**: Use HTTPS in production.
- **CORS**: Currently allows all origins for development.

## 🔄 Workflow

```
Frontend (React Native/Expo)
    ↓
    ├─ Login/Signup
    │   └→ Backend (Express)
    │       └→ Generate JWT Token
    │           └→ Store in SecureStore
    │
    ├─ Request Data (with token)
    │   └→ Backend validates token
    │       └→ Read from db.json
    │           └→ Return to Frontend
    │
    └─ Modify Data
        └→ Backend validates token
            └→ Update db.json
                └→ Return response
```

## 📈 Next Steps

1. Add real database (PostgreSQL/MongoDB)
2. Implement payment processing
3. Add push notifications
4. Enable user reviews and ratings
5. Implement real-time notifications with WebSockets
6. Deploy to production

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Submit issues and PRs.

---

**Made with ❤️ for futsal lovers**
