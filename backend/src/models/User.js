const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic user info
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    minlength: 8,
    select: false, // Don't include password in queries by default
  },
  
  // Wallet authentication
  walletAddress: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: props => `${props.value} is not a valid wallet address!`
    }
  },
  
  // Social login info
  socialLogins: {
    google: {
      token: String,
      lastLogin: Date,
    },
    apple: {
      token: String,
      lastLogin: Date,
    },
    facebook: {
      token: String,
      lastLogin: Date,
    },
  },
  
  // Profile info
  picture: {
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  
  // Authentication type
  loginType: {
    type: String,
    enum: ['email', 'social', 'wallet'],
    required: true,
  },
  
  // User stats
  stats: {
    totalChallenges: {
      type: Number,
      default: 0,
    },
    completedChallenges: {
      type: Number,
      default: 0,
    },
    totalRewards: {
      type: String,
      default: '0 XION',
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    rank: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner',
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    totalTimeSpent: {
      type: Number, // in hours
      default: 0,
    },
  },
  
  // Preferences
  preferences: {
    notifications: {
      type: Boolean,
      default: true,
    },
    darkMode: {
      type: Boolean,
      default: true,
    },
    biometricLogin: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: 'en',
    },
  },
  
  // Timestamps
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  walletVerified: {
    type: Boolean,
    default: false,
  },
  
  // Security
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lockedUntil: {
    type: Date,
  },
  
  // GDPR compliance
  dataConsent: {
    type: Boolean,
    default: false,
  },
  marketingConsent: {
    type: Boolean,
    default: false,
  },
  
}, {
  timestamps: true,
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ 'stats.rank': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  if (this.name) return this.name;
  if (this.email) return this.email.split('@')[0];
  if (this.walletAddress) return `Wallet ${this.walletAddress.slice(-6)}`;
  return 'Anonymous User';
});

// Virtual for user identifier
userSchema.virtual('identifier').get(function() {
  return this.email || this.walletAddress || this._id.toString();
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to increment failed login attempts
userSchema.methods.incrementFailedAttempts = function() {
  this.failedLoginAttempts += 1;
  
  // Lock account after 5 failed attempts for 15 minutes
  if (this.failedLoginAttempts >= 5) {
    this.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  }
  
  return this.save();
};

// Instance method to reset failed login attempts
userSchema.methods.resetFailedAttempts = function() {
  this.failedLoginAttempts = 0;
  this.lockedUntil = undefined;
  return this.save();
};

// Instance method to check if account is locked
userSchema.methods.isLocked = function() {
  if (!this.lockedUntil) return false;
  return new Date() < this.lockedUntil;
};

// Instance method to update stats
userSchema.methods.updateStats = function(stats) {
  this.stats = { ...this.stats, ...stats };
  return this.save();
};

// Instance method to increment challenge completion
userSchema.methods.completeChallenge = function(reward) {
  this.stats.completedChallenges += 1;
  this.stats.totalChallenges += 1;
  
  // Update total rewards (simple string concatenation for now)
  const currentReward = parseInt(this.stats.totalRewards.split(' ')[0]) || 0;
  const newReward = parseInt(reward.split(' ')[0]) || 0;
  this.stats.totalRewards = `${currentReward + newReward} XION`;
  
  // Update rank based on completed challenges
  if (this.stats.completedChallenges >= 20) {
    this.stats.rank = 'Expert';
  } else if (this.stats.completedChallenges >= 10) {
    this.stats.rank = 'Advanced';
  } else if (this.stats.completedChallenges >= 5) {
    this.stats.rank = 'Intermediate';
  }
  
  return this.save();
};

// Static method to find by email or wallet address
userSchema.statics.findByEmailOrWallet = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier },
      { walletAddress: identifier }
    ]
  });
};

// Static method to get leaderboard
userSchema.statics.getLeaderboard = function(limit = 10) {
  return this.find()
    .sort({ 'stats.completedChallenges': -1, 'stats.totalRewards': -1 })
    .limit(limit)
    .select('name picture stats.rank stats.completedChallenges stats.totalRewards');
};

// JSON transform to remove sensitive data
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.failedLoginAttempts;
  delete userObject.lockedUntil;
  delete userObject.socialLogins;
  return userObject;
};

module.exports = mongoose.model('User', userSchema); 