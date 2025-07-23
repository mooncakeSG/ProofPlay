const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Import middleware
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../utils/logger');

// Mock users data (replace with database)
let users = [
  {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    walletAddress: 'xion1example',
    profile: {
      avatar: null,
      bio: 'Blockchain enthusiast and developer',
      location: 'San Francisco, CA',
      website: 'https://example.com',
    },
    stats: {
      challengesCompleted: 5,
      totalRewards: '150 XION',
      currentStreak: 3,
      totalProofs: 8,
    },
    preferences: {
      notifications: true,
      emailUpdates: true,
      theme: 'dark',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Validation middleware
const validateUserUpdate = [
  body('username').optional().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('profile.bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('profile.location').optional().isLength({ max: 100 }).withMessage('Location must be less than 100 characters'),
  body('profile.website').optional().isURL().withMessage('Website must be a valid URL'),
];

// GET /api/users/profile - Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    
    // Remove sensitive data
    const { password, ...userProfile } = user;
    
    logger.info(`User profile retrieved: ${req.user.id}`);
    
    res.json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    logger.error('Error retrieving user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user profile',
    });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', authenticateToken, validateUserUpdate, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    
    const { username, profile, preferences } = req.body;
    
    users[userIndex] = {
      ...users[userIndex],
      ...(username && { username }),
      ...(profile && { profile: { ...users[userIndex].profile, ...profile } }),
      ...(preferences && { preferences: { ...users[userIndex].preferences, ...preferences } }),
      updatedAt: new Date(),
    };
    
    // Remove sensitive data
    const { password, ...userProfile } = users[userIndex];
    
    logger.info(`User profile updated: ${req.user.id}`);
    
    res.json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user profile',
    });
  }
});

// GET /api/users/stats - Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    
    logger.info(`User stats retrieved: ${req.user.id}`);
    
    res.json({
      success: true,
      data: user.stats,
    });
  } catch (error) {
    logger.error('Error retrieving user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user stats',
    });
  }
});

// PUT /api/users/stats - Update user statistics
router.put('/stats', authenticateToken, async (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    
    const { challengesCompleted, totalRewards, currentStreak, totalProofs } = req.body;
    
    users[userIndex].stats = {
      ...users[userIndex].stats,
      ...(challengesCompleted !== undefined && { challengesCompleted }),
      ...(totalRewards !== undefined && { totalRewards }),
      ...(currentStreak !== undefined && { currentStreak }),
      ...(totalProofs !== undefined && { totalProofs }),
    };
    
    users[userIndex].updatedAt = new Date();
    
    logger.info(`User stats updated: ${req.user.id}`);
    
    res.json({
      success: true,
      data: users[userIndex].stats,
    });
  } catch (error) {
    logger.error('Error updating user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user stats',
    });
  }
});

// DELETE /api/users/account - Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    logger.info(`User account deleted: ${req.user.id}`);
    
    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting user account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account',
    });
  }
});

module.exports = router; 