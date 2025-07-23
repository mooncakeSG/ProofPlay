const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Import middleware
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../utils/logger');

// Mock challenges data (replace with database)
let challenges = [
  {
    id: '1',
    title: 'Learn React Native',
    description: 'Complete a React Native tutorial and build a simple app',
    category: 'Programming',
    difficulty: 'Hard',
    reward: '50 XION',
    requirements: ['Complete tutorial', 'Build app', 'Submit proof'],
    image: 'laptop',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Volunteer for 10 Hours',
    description: 'Volunteer at a local community organization',
    category: 'Community',
    difficulty: 'Medium',
    reward: '30 XION',
    requirements: ['Find organization', 'Complete hours', 'Submit proof'],
    image: 'handshake',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Build a Smart Contract',
    description: 'Create and deploy a smart contract on XION blockchain',
    category: 'Blockchain',
    difficulty: 'Hard',
    reward: '75 XION',
    requirements: ['Write contract', 'Test contract', 'Deploy contract'],
    image: 'link',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Read 5 Books in a Month',
    description: 'Read 5 books and write a summary for each',
    category: 'Education',
    difficulty: 'Medium',
    reward: '40 XION',
    requirements: ['Read books', 'Write summaries', 'Submit proof'],
    image: 'book',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Validation middleware
const validateChallenge = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('category').isIn(['Programming', 'Community', 'Blockchain', 'Education', 'Fitness', 'Creative']).withMessage('Invalid category'),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']).withMessage('Invalid difficulty level'),
  body('reward').matches(/^\d+\s+XION$/).withMessage('Reward must be in format "XX XION"'),
];

// GET /api/challenges/public - Get all challenges (public, no auth required)
router.get('/public', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    
    let filteredChallenges = [...challenges];
    
    // Filter by category
    if (category) {
      filteredChallenges = filteredChallenges.filter(c => c.category === category);
    }
    
    // Filter by difficulty
    if (difficulty) {
      filteredChallenges = filteredChallenges.filter(c => c.difficulty === difficulty);
    }
    
    // Search by title or description
    if (search) {
      const searchLower = search.toLowerCase();
      filteredChallenges = filteredChallenges.filter(c => 
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower)
      );
    }
    
    logger.info(`Public challenges retrieved: ${filteredChallenges.length}`);
    
    res.json({
      success: true,
      data: filteredChallenges,
      total: filteredChallenges.length
    });
  } catch (error) {
    logger.error('Error retrieving public challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve challenges'
    });
  }
});

// GET /api/challenges - Get all challenges (authenticated)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    
    let filteredChallenges = [...challenges];
    
    // Filter by category
    if (category) {
      filteredChallenges = filteredChallenges.filter(c => c.category === category);
    }
    
    // Filter by difficulty
    if (difficulty) {
      filteredChallenges = filteredChallenges.filter(c => c.difficulty === difficulty);
    }
    
    // Search by title or description
    if (search) {
      const searchLower = search.toLowerCase();
      filteredChallenges = filteredChallenges.filter(c => 
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower)
      );
    }
    
    logger.info(`Challenges retrieved: ${filteredChallenges.length}`);
    
    res.json({
      success: true,
      data: filteredChallenges,
      total: filteredChallenges.length,
    });
  } catch (error) {
    logger.error('Error retrieving challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve challenges',
    });
  }
});

// GET /api/challenges/:id - Get challenge by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = challenges.find(c => c.id === id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }
    
    logger.info(`Challenge retrieved: ${id}`);
    
    res.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    logger.error('Error retrieving challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve challenge',
    });
  }
});

// POST /api/challenges - Create new challenge
router.post('/', authenticateToken, validateChallenge, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    const { title, description, category, difficulty, reward, requirements, image } = req.body;
    
    const newChallenge = {
      id: Date.now().toString(),
      title,
      description,
      category,
      difficulty,
      reward,
      requirements: requirements || [],
      image: image || 'default',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    challenges.push(newChallenge);
    
    logger.info(`Challenge created: ${newChallenge.id}`);
    
    res.status(201).json({
      success: true,
      data: newChallenge,
    });
  } catch (error) {
    logger.error('Error creating challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create challenge',
    });
  }
});

// PUT /api/challenges/:id - Update challenge
router.put('/:id', authenticateToken, validateChallenge, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    const { id } = req.params;
    const challengeIndex = challenges.findIndex(c => c.id === id);
    
    if (challengeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }
    
    const { title, description, category, difficulty, reward, requirements, image } = req.body;
    
    challenges[challengeIndex] = {
      ...challenges[challengeIndex],
      title,
      description,
      category,
      difficulty,
      reward,
      requirements: requirements || challenges[challengeIndex].requirements,
      image: image || challenges[challengeIndex].image,
      updatedAt: new Date(),
    };
    
    logger.info(`Challenge updated: ${id}`);
    
    res.json({
      success: true,
      data: challenges[challengeIndex],
    });
  } catch (error) {
    logger.error('Error updating challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update challenge',
    });
  }
});

// DELETE /api/challenges/:id - Delete challenge
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const challengeIndex = challenges.findIndex(c => c.id === id);
    
    if (challengeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }
    
    const deletedChallenge = challenges.splice(challengeIndex, 1)[0];
    
    logger.info(`Challenge deleted: ${id}`);
    
    res.json({
      success: true,
      message: 'Challenge deleted successfully',
      data: deletedChallenge,
    });
  } catch (error) {
    logger.error('Error deleting challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete challenge',
    });
  }
});

module.exports = router; 