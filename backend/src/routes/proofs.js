const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Import middleware
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../utils/logger');

// Mock proofs data (replace with database)
let proofs = [
  {
    id: '1',
    userId: '1',
    challengeId: '1',
    type: 'image',
    data: 'https://example.com/proof1.jpg',
    status: 'pending',
    submittedAt: new Date(),
    verifiedAt: null,
    verifiedBy: null,
  },
];

// Validation middleware
const validateProof = [
  body('challengeId').isString().notEmpty().withMessage('Challenge ID is required'),
  body('type').isIn(['image', 'video', 'document', 'link']).withMessage('Invalid proof type'),
  body('data').isString().notEmpty().withMessage('Proof data is required'),
];

// GET /api/proofs - Get user's proofs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userProofs = proofs.filter(p => p.userId === req.user.id);
    
    logger.info(`Proofs retrieved for user: ${req.user.id}`);
    
    res.json({
      success: true,
      data: userProofs,
      total: userProofs.length,
    });
  } catch (error) {
    logger.error('Error retrieving proofs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve proofs',
    });
  }
});

// GET /api/proofs/:id - Get proof by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const proof = proofs.find(p => p.id === id && p.userId === req.user.id);
    
    if (!proof) {
      return res.status(404).json({
        success: false,
        error: 'Proof not found',
      });
    }
    
    logger.info(`Proof retrieved: ${id}`);
    
    res.json({
      success: true,
      data: proof,
    });
  } catch (error) {
    logger.error('Error retrieving proof:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve proof',
    });
  }
});

// POST /api/proofs - Submit new proof
router.post('/', authenticateToken, validateProof, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    const { challengeId, type, data, description } = req.body;
    
    const newProof = {
      id: Date.now().toString(),
      userId: req.user.id,
      challengeId,
      type,
      data,
      description: description || '',
      status: 'pending',
      submittedAt: new Date(),
      verifiedAt: null,
      verifiedBy: null,
    };
    
    proofs.push(newProof);
    
    logger.info(`Proof submitted: ${newProof.id}`);
    
    res.status(201).json({
      success: true,
      data: newProof,
    });
  } catch (error) {
    logger.error('Error submitting proof:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit proof',
    });
  }
});

// PUT /api/proofs/:id/verify - Verify proof (admin only)
router.put('/:id/verify', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    
    const proofIndex = proofs.findIndex(p => p.id === id);
    
    if (proofIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Proof not found',
      });
    }
    
    proofs[proofIndex] = {
      ...proofs[proofIndex],
      status: status || 'verified',
      verifiedAt: new Date(),
      verifiedBy: req.user.id,
      feedback: feedback || '',
    };
    
    logger.info(`Proof verified: ${id} by ${req.user.id}`);
    
    res.json({
      success: true,
      data: proofs[proofIndex],
    });
  } catch (error) {
    logger.error('Error verifying proof:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify proof',
    });
  }
});

// DELETE /api/proofs/:id - Delete proof
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const proofIndex = proofs.findIndex(p => p.id === id && p.userId === req.user.id);
    
    if (proofIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Proof not found',
      });
    }
    
    const deletedProof = proofs.splice(proofIndex, 1)[0];
    
    logger.info(`Proof deleted: ${id}`);
    
    res.json({
      success: true,
      message: 'Proof deleted successfully',
      data: deletedProof,
    });
  } catch (error) {
    logger.error('Error deleting proof:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete proof',
    });
  }
});

module.exports = router; 