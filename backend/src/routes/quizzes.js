const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Import middleware
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../utils/logger');

// Mock quizzes data (replace with database)
let quizzes = [
  {
    id: '1',
    title: 'XION Blockchain Basics',
    description: 'Test your knowledge of XION blockchain fundamentals',
    category: 'Blockchain',
    difficulty: 'Easy',
    questions: [
      {
        id: '1',
        question: 'What is XION blockchain?',
        options: [
          'A Layer 1 blockchain',
          'A Layer 2 scaling solution',
          'A decentralized exchange',
          'A smart contract platform'
        ],
        correctAnswer: 0,
        explanation: 'XION is a Layer 1 blockchain designed for consumer applications.'
      },
      {
        id: '2',
        question: 'What is zkTLS?',
        options: [
          'A zero-knowledge proof system',
          'A transport layer security protocol',
          'A combination of zero-knowledge proofs and TLS',
          'A blockchain consensus mechanism'
        ],
        correctAnswer: 2,
        explanation: 'zkTLS combines zero-knowledge proofs with Transport Layer Security for enhanced privacy.'
      }
    ],
    timeLimit: 15,
    reward: '25 XION',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'zkTLS Protocol',
    description: 'Learn about zero-knowledge TLS and proof verification',
    category: 'Blockchain',
    difficulty: 'Hard',
    questions: [
      {
        id: '1',
        question: 'How does zkTLS improve privacy?',
        options: [
          'By encrypting all data',
          'By using zero-knowledge proofs to verify without revealing data',
          'By using blockchain technology',
          'By implementing TLS 1.3'
        ],
        correctAnswer: 1,
        explanation: 'zkTLS uses zero-knowledge proofs to verify data without revealing the actual data.'
      }
    ],
    timeLimit: 20,
    reward: '50 XION',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock quiz attempts (replace with database)
let quizAttempts = [];

// Validation middleware
const validateQuizSubmission = [
  body('quizId').isString().notEmpty().withMessage('Quiz ID is required'),
  body('answers').isArray().withMessage('Answers must be an array'),
  body('answers.*.questionId').isString().notEmpty().withMessage('Question ID is required'),
  body('answers.*.selectedAnswer').isInt({ min: 0, max: 3 }).withMessage('Selected answer must be between 0 and 3'),
];

// GET /api/quizzes - Get all quizzes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    
    let filteredQuizzes = [...quizzes];
    
    // Filter by category
    if (category) {
      filteredQuizzes = filteredQuizzes.filter(q => q.category === category);
    }
    
    // Filter by difficulty
    if (difficulty) {
      filteredQuizzes = filteredQuizzes.filter(q => q.difficulty === difficulty);
    }
    
    // Remove questions from response (only show quiz metadata)
    const quizList = filteredQuizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      reward: quiz.reward,
      questionCount: quiz.questions.length,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    }));
    
    logger.info(`Quizzes retrieved: ${quizList.length}`);
    
    res.json({
      success: true,
      data: quizList,
      total: quizList.length,
    });
  } catch (error) {
    logger.error('Error retrieving quizzes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve quizzes',
    });
  }
});

// GET /api/quizzes/:id - Get quiz by ID (with questions)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = quizzes.find(q => q.id === id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
      });
    }
    
    // Remove correct answers from questions
    const quizWithQuestions = {
      ...quiz,
      questions: quiz.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
      })),
    };
    
    logger.info(`Quiz retrieved: ${id}`);
    
    res.json({
      success: true,
      data: quizWithQuestions,
    });
  } catch (error) {
    logger.error('Error retrieving quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve quiz',
    });
  }
});

// POST /api/quizzes/:id/submit - Submit quiz answers
router.post('/:id/submit', authenticateToken, validateQuizSubmission, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    const { id } = req.params;
    const { answers, timeSpent } = req.body;
    
    const quiz = quizzes.find(q => q.id === id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
      });
    }
    
    // Calculate score
    let correctAnswers = 0;
    const results = [];
    
    answers.forEach(answer => {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === answer.selectedAnswer;
        if (isCorrect) correctAnswers++;
        
        results.push({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation,
        });
      }
    });
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= 70; // 70% passing threshold
    
    // Create quiz attempt record
    const attempt = {
      id: Date.now().toString(),
      userId: req.user.id,
      quizId: id,
      answers,
      results,
      score,
      passed,
      timeSpent: timeSpent || 0,
      submittedAt: new Date(),
    };
    
    quizAttempts.push(attempt);
    
    logger.info(`Quiz submitted: ${id} by ${req.user.id}, score: ${score}%`);
    
    res.json({
      success: true,
      data: {
        attemptId: attempt.id,
        score,
        passed,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        results,
        reward: passed ? quiz.reward : '0 XION',
      },
    });
  } catch (error) {
    logger.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit quiz',
    });
  }
});

// GET /api/quizzes/attempts - Get user's quiz attempts
router.get('/attempts', authenticateToken, async (req, res) => {
  try {
    const userAttempts = quizAttempts.filter(a => a.userId === req.user.id);
    
    logger.info(`Quiz attempts retrieved for user: ${req.user.id}`);
    
    res.json({
      success: true,
      data: userAttempts,
      total: userAttempts.length,
    });
  } catch (error) {
    logger.error('Error retrieving quiz attempts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve quiz attempts',
    });
  }
});

// GET /api/quizzes/attempts/:id - Get specific quiz attempt
router.get('/attempts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const attempt = quizAttempts.find(a => a.id === id && a.userId === req.user.id);
    
    if (!attempt) {
      return res.status(404).json({
        success: false,
        error: 'Quiz attempt not found',
      });
    }
    
    logger.info(`Quiz attempt retrieved: ${id}`);
    
    res.json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    logger.error('Error retrieving quiz attempt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve quiz attempt',
    });
  }
});

module.exports = router; 