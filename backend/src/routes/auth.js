const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
// Mock users data (replace with database)
let mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: '$2a$10$example.hash',
    name: 'Test User',
    walletAddress: 'xion1example',
    loginType: 'email',
    createdAt: new Date(),
  },
];
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const { sanitizeInput } = require('../utils/sanitizer');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: sanitizeInput(email),
      password: hashedPassword,
      name: sanitizeInput(name),
      loginType: 'email',
      createdAt: new Date(),
    };

    mockUsers.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = { ...newUser };
    delete userResponse.password;

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse,
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Update last login
    user.lastLogin = new Date();

    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;

    logger.info(`User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   POST /api/auth/social
// @desc    Social login (Google, Apple, etc.)
// @access  Public
router.post('/social', [
  body('provider').isIn(['google', 'apple', 'facebook']).withMessage('Invalid provider'),
  body('token').notEmpty().withMessage('Social token is required'),
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { provider, token, email, name, picture } = req.body;

    // TODO: Verify social token with provider (Google, Apple, etc.)
    // For now, we'll trust the token and create/update user

    // Find or create user
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user's social login info
      user.socialLogins = user.socialLogins || {};
      user.socialLogins[provider] = {
        token,
        lastLogin: new Date(),
      };
      user.lastLogin = new Date();
    } else {
      // Create new user
      user = new User({
        email: sanitizeInput(email),
        name: sanitizeInput(name),
        picture,
        loginType: 'social',
        socialLogins: {
          [provider]: {
            token,
            lastLogin: new Date(),
          },
        },
      });
    }

    await user.save();

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`Social login successful: ${email} via ${provider}`);

    res.json({
      message: 'Social login successful',
      token: jwtToken,
      user: userResponse,
    });
  } catch (error) {
    logger.error('Social login error:', error);
    res.status(500).json({ error: 'Server error during social login' });
  }
});

// @route   POST /api/auth/wallet
// @desc    Connect wallet
// @access  Public
router.post('/wallet', [
  body('address').isLength({ min: 42, max: 42 }).withMessage('Invalid wallet address'),
  body('signature').notEmpty().withMessage('Signature is required'),
  body('message').notEmpty().withMessage('Message is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { address, signature, message } = req.body;

    // TODO: Verify wallet signature
    // For now, we'll trust the signature and create/update user

    // Find or create user
    let user = await User.findOne({ walletAddress: address });

    if (user) {
      // Update existing user's wallet info
      user.walletAddress = address;
      user.lastLogin = new Date();
    } else {
      // Create new user
      user = new User({
        walletAddress: address,
        name: `Wallet User ${address.slice(-6)}`,
        loginType: 'wallet',
      });
    }

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, walletAddress: address },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`Wallet connected: ${address}`);

    res.json({
      message: 'Wallet connected successfully',
      token,
      user: userResponse,
    });
  } catch (error) {
    logger.error('Wallet connection error:', error);
    res.status(500).json({ error: 'Server error during wallet connection' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return a success message
    logger.info(`User logged out: ${req.user.email || req.user.walletAddress}`);

    res.json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ error: 'Server error during logout' });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Token refreshed successfully',
      token,
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(500).json({ error: 'Server error during token refresh' });
  }
});

module.exports = router; 