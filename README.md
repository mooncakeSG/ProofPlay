# 🎯 ProofPlay - Complete Challenges & Earn Rewards with XION

A full-stack React Native mobile application with Express.js backend for completing challenges and earning XION blockchain rewards.

## 🚀 Features

### Frontend (React Native + Expo)
- **Cross-platform mobile app** (iOS & Android)
- **Modern UI/UX** with dark theme and smooth animations
- **Real-time challenge browsing** with search and filtering
- **Wallet integration** with XION blockchain
- **Social authentication** (Google, Apple, Facebook)
- **Progress tracking** and achievement system
- **Proof submission** with image/video upload
- **Quiz system** for educational challenges

### Backend (Node.js + Express)
- **RESTful API** with comprehensive endpoints
- **JWT authentication** and session management
- **Rate limiting** and security middleware
- **Input validation** and sanitization
- **Logging system** with Winston
- **CORS configuration** for cross-platform development
- **Environment configuration** with dotenv
- **Mock data mode** for development

## 📱 Screenshots

*Screenshots will be added here*

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation and routing
- **Expo Vector Icons** - Icon library
- **AsyncStorage** - Local data persistence
- **Expo SecureStore** - Secure data storage

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Winston** - Logging
- **MongoDB** - Database (ready for integration)

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Git

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/mooncakeSG/ProofPlay.git
cd ProofPlay

# Install dependencies
npm install

# Start the development server
npm start
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
npm run setup

# Start the development server
npm run dev
```

### Environment Configuration
1. Copy `backend/env.example` to `backend/.env`
2. Update the required environment variables:
   - `JWT_SECRET` - Generate a secure random string
   - `JWT_REFRESH_SECRET` - Generate a secure random string
   - `SESSION_SECRET` - Generate a secure random string
   - `COOKIE_SECRET` - Generate a secure random string

## 📁 Project Structure

```
ProofPlay/
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── screens/           # Screen components
│   ├── services/          # API and business logic
│   └── App.tsx           # Main app component
├── backend/               # Backend source code
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Database models
│   │   ├── utils/        # Utility functions
│   │   └── server.js     # Main server file
│   ├── env.example       # Environment template
│   └── package.json      # Backend dependencies
├── assets/               # Static assets
└── package.json         # Frontend dependencies
```

## 🔧 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /api/public/challenges` - Get all challenges (no auth required)

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/wallet` - Wallet authentication
- `POST /api/auth/social` - Social authentication

### Protected Endpoints
- `GET /api/challenges` - Get user challenges
- `POST /api/challenges` - Create challenge
- `GET /api/proofs` - Get user proofs
- `POST /api/proofs` - Submit proof
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/quizzes` - Get quizzes
- `POST /api/quizzes/:id/submit` - Submit quiz

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Prevent API abuse
- **Input Validation** - Sanitize user inputs
- **CORS Protection** - Control cross-origin requests
- **Helmet Security** - HTTP security headers
- **Environment Variables** - Secure configuration

## 🧪 Development

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests (when implemented)
cd backend && npm test
```

### Code Quality
```bash
# Security audit
npm run audit

# Type checking
npx tsc --noEmit
```

## 🚀 Deployment

### Frontend (Expo)
1. Build for production: `expo build`
2. Deploy to app stores via Expo Application Services

### Backend
1. Set up production environment variables
2. Deploy to your preferred hosting service (Heroku, AWS, etc.)
3. Configure database connection
4. Set up SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **XION Labs** - Blockchain infrastructure
- **Expo** - Development platform
- **React Native** - Mobile framework
- **Express.js** - Backend framework

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Made with ❤️ by the ProofPlay Team** 