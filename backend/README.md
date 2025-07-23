# ProofPlay Backend API

A comprehensive backend API for the ProofPlay application, built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
npm run setup
```
This will create a `.env` file from the `env.example` template.

### 3. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 📋 Environment Configuration

### 🔑 Required Environment Variables

#### Basic Functionality
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_REFRESH_SECRET=your-refresh-token-secret-change-this-in-production-2024
SESSION_SECRET=your-session-secret-change-this-in-production-2024
COOKIE_SECRET=your-cookie-secret-change-this-in-production-2024
```

#### Database (Optional for development - uses mock data)
```env
MONGODB_URI=mongodb://localhost:27017/proofplay
```

#### CORS Configuration
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,http://localhost:19000
```

### 🌐 Social Login APIs

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3001/api/auth/google/callback`

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Apple OAuth
1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Create an App ID
3. Enable Sign In with Apple
4. Create a Service ID
5. Generate a private key

```env
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key
```

#### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs

```env
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

### 🔗 Wallet Connect

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Get your project ID

```env
WALLET_CONNECT_PROJECT_ID=your-walletconnect-project-id
```

### 📧 Email Configuration

#### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in your environment

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### ☁️ AWS S3 (File Uploads)

1. Create an AWS account
2. Create an S3 bucket
3. Create an IAM user with S3 permissions
4. Get access keys

```env
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=proofplay-uploads
```

### 🔗 XION Blockchain

```env
XION_NETWORK_URL=https://xion-testnet.burnt.com
XION_CHAIN_ID=xion-testnet-1
XION_CONTRACT_ADDRESS=xion1examplecontractaddress
XION_REWARD_CONTRACT=xion1rewardcontractaddress
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/social` - Social login
- `POST /api/auth/wallet` - Wallet login

### Challenges
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/:id` - Get challenge by ID
- `POST /api/challenges` - Create challenge
- `PUT /api/challenges/:id` - Update challenge
- `DELETE /api/challenges/:id` - Delete challenge

### Proofs
- `GET /api/proofs` - Get user's proofs
- `POST /api/proofs` - Submit proof
- `PUT /api/proofs/:id/verify` - Verify proof
- `DELETE /api/proofs/:id` - Delete proof

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/stats` - Get user stats
- `PUT /api/users/stats` - Update stats

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz with questions
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/attempts` - Get user's quiz attempts

## 🛠️ Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run setup` - Setup environment file
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Project Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── logs/                # Log files
├── uploads/             # File uploads
├── .env                 # Environment variables
├── env.example          # Environment template
└── package.json         # Dependencies and scripts
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Prevent abuse with request limits
- **Input Validation** - Validate all user inputs
- **XSS Protection** - Sanitize user inputs
- **CORS Configuration** - Control cross-origin requests
- **Helmet Security** - Security headers
- **Password Hashing** - Bcrypt password encryption

## 📊 Monitoring

### Logging
- Winston logger with file and console output
- Request/response logging
- Error tracking
- Performance monitoring

### Health Check
- `GET /health` - Server health status
- Uptime monitoring
- Environment information

## 🚀 Deployment

### Production Checklist
1. Set `NODE_ENV=production`
2. Update all secrets and API keys
3. Configure production database
4. Set up SSL/TLS certificates
5. Configure reverse proxy (nginx)
6. Set up monitoring and logging
7. Configure backup strategy

### Environment Variables for Production
```env
NODE_ENV=production
LOG_LEVEL=warn
DEBUG=false
MOCK_DATA=false
ENABLE_RATE_LIMITING=true
ENABLE_COMPRESSION=true
ENABLE_CACHING=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 