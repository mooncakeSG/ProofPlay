const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');

// Mock challenges data for public access
const publicChallenges = [
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

// GET /api/public/challenges - Get all challenges (public, no auth required)
router.get('/challenges', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    
    let filteredChallenges = [...publicChallenges];
    
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

module.exports = router; 