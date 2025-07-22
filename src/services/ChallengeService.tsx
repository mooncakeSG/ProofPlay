import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Challenge interfaces
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  reward: string;
  deadline: string;
  participants: number;
  status: 'available' | 'in-progress' | 'completed';
  progress?: number;
  image: string;
  requirements: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeProgress {
  challengeId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  startDate?: string;
  completionDate?: string;
  proofSubmitted?: boolean;
  proofHash?: string;
  rewardClaimed?: boolean;
}

export interface UserStats {
  totalChallenges: number;
  completedChallenges: number;
  totalRewards: string;
  currentStreak: number;
  rank: string;
}

// Mock challenge data
const MOCK_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Complete a 5K Run',
    description: 'Run 5 kilometers and submit proof of completion. Track your route using any fitness app and share your achievement.',
    category: 'Fitness',
    difficulty: 'Easy',
    reward: '50 XION tokens',
    deadline: '2024-12-31',
    participants: 127,
    status: 'available',
    image: '🏃‍♂️',
    requirements: [
      'Use a fitness tracking app',
      'Complete 5 kilometers',
      'Submit screenshot of route',
      'Include timestamp and distance'
    ],
    tags: ['fitness', 'running', 'health'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Learn React Native',
    description: 'Complete a comprehensive React Native course and build a functional mobile app. Submit your final project and code repository.',
    category: 'Programming',
    difficulty: 'Hard',
    reward: '100 XION tokens',
    deadline: '2024-12-31',
    participants: 89,
    status: 'available',
    image: '💻',
    requirements: [
      'Complete React Native course',
      'Build a functional app',
      'Submit GitHub repository',
      'Include README documentation'
    ],
    tags: ['programming', 'react-native', 'mobile'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    title: 'Volunteer for 10 Hours',
    description: 'Volunteer at a local charity or community organization. Document your hours and activities with photos and testimonials.',
    category: 'Community',
    difficulty: 'Medium',
    reward: '75 XION tokens',
    deadline: '2024-12-31',
    participants: 45,
    status: 'available',
    image: '🤝',
    requirements: [
      'Find local volunteer opportunity',
      'Complete 10 hours of service',
      'Document activities with photos',
      'Get supervisor signature'
    ],
    tags: ['community', 'volunteer', 'charity'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    title: 'Build a Smart Contract',
    description: 'Create and deploy a simple smart contract on XION blockchain. Include basic functionality like token transfer or voting system.',
    category: 'Blockchain',
    difficulty: 'Hard',
    reward: '200 XION tokens',
    deadline: '2024-12-31',
    participants: 23,
    status: 'available',
    image: '⛓️',
    requirements: [
      'Learn Solidity basics',
      'Design smart contract',
      'Deploy to XION testnet',
      'Submit contract address and code'
    ],
    tags: ['blockchain', 'smart-contract', 'solidity'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    title: 'Read 5 Books in a Month',
    description: 'Read 5 books from different genres and submit detailed book reviews or reading logs with your insights.',
    category: 'Education',
    difficulty: 'Medium',
    reward: '80 XION tokens',
    deadline: '2024-12-31',
    participants: 67,
    status: 'available',
    image: '📚',
    requirements: [
      'Read 5 different books',
      'Write detailed reviews',
      'Include reading time logs',
      'Share key insights learned'
    ],
    tags: ['education', 'reading', 'books'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    title: 'Create Digital Art',
    description: 'Create an original digital artwork using any software. Submit the final piece and process screenshots showing your creative journey.',
    category: 'Creative',
    difficulty: 'Easy',
    reward: '60 XION tokens',
    deadline: '2024-12-31',
    participants: 156,
    status: 'available',
    image: '🎨',
    requirements: [
      'Use digital art software',
      'Create original artwork',
      'Document creation process',
      'Submit final piece and screenshots'
    ],
    tags: ['creative', 'art', 'digital'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    title: 'Learn a New Language',
    description: 'Start learning a new language and achieve basic conversational skills. Submit progress logs and practice recordings.',
    category: 'Education',
    difficulty: 'Medium',
    reward: '90 XION tokens',
    deadline: '2024-12-31',
    participants: 34,
    status: 'available',
    image: '🗣️',
    requirements: [
      'Choose a new language',
      'Complete beginner course',
      'Practice with native speakers',
      'Submit progress recordings'
    ],
    tags: ['education', 'language', 'communication'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '8',
    title: 'Build a Garden',
    description: 'Start a small garden and grow your own vegetables or herbs. Document the growth process from seed to harvest.',
    category: 'Lifestyle',
    difficulty: 'Easy',
    reward: '40 XION tokens',
    deadline: '2024-12-31',
    participants: 78,
    status: 'available',
    image: '🌱',
    requirements: [
      'Plan and prepare garden space',
      'Plant seeds or seedlings',
      'Document growth progress',
      'Harvest and share results'
    ],
    tags: ['lifestyle', 'gardening', 'sustainability'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Context interface
interface ChallengeContextType {
  challenges: Challenge[];
  userProgress: ChallengeProgress[];
  userStats: UserStats;
  isLoading: boolean;
  getChallenges: (filter?: string) => Promise<Challenge[]>;
  getChallengeById: (id: string) => Challenge | undefined;
  startChallenge: (challengeId: string) => Promise<void>;
  updateProgress: (challengeId: string, progress: number) => Promise<void>;
  completeChallenge: (challengeId: string, proofHash: string) => Promise<void>;
  getUserProgress: () => Promise<ChallengeProgress[]>;
  getUserStats: () => Promise<UserStats>;
}

// Create context
const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

// Provider component
export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [userProgress, setUserProgress] = useState<ChallengeProgress[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalChallenges: 0,
    completedChallenges: 0,
    totalRewards: '0 XION',
    currentStreak: 0,
    rank: 'Beginner',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load user progress on mount
  useEffect(() => {
    loadUserProgress();
    loadUserStats();
  }, []);

  const loadUserProgress = async () => {
    try {
      const progress = await SecureStore.getItemAsync('user_challenge_progress');
      if (progress) {
        setUserProgress(JSON.parse(progress));
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await SecureStore.getItemAsync('user_stats');
      if (stats) {
        setUserStats(JSON.parse(stats));
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const saveUserProgress = async (progress: ChallengeProgress[]) => {
    try {
      await SecureStore.setItemAsync('user_challenge_progress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  };

  const saveUserStats = async (stats: UserStats) => {
    try {
      await SecureStore.setItemAsync('user_stats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  };

  const getChallenges = async (filter?: string): Promise<Challenge[]> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      
      let filteredChallenges = [...challenges];
      
      if (filter) {
        filteredChallenges = challenges.filter(challenge => 
          challenge.category.toLowerCase().includes(filter.toLowerCase()) ||
          challenge.title.toLowerCase().includes(filter.toLowerCase()) ||
          challenge.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
        );
      }
      
      return filteredChallenges;
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getChallengeById = (id: string): Challenge | undefined => {
    return challenges.find(challenge => challenge.id === id);
  };

  const startChallenge = async (challengeId: string): Promise<void> => {
    try {
      const existingProgress = userProgress.find(p => p.challengeId === challengeId);
      
      if (existingProgress) {
        Alert.alert('Already Started', 'You have already started this challenge!');
        return;
      }

      const newProgress: ChallengeProgress = {
        challengeId,
        status: 'in-progress',
        progress: 0,
        startDate: new Date().toISOString(),
      };

      const updatedProgress = [...userProgress, newProgress];
      setUserProgress(updatedProgress);
      await saveUserProgress(updatedProgress);

      Alert.alert('Challenge Started!', 'Good luck with your challenge!');
    } catch (error) {
      console.error('Error starting challenge:', error);
      Alert.alert('Error', 'Failed to start challenge. Please try again.');
    }
  };

  const updateProgress = async (challengeId: string, progress: number): Promise<void> => {
    try {
      const updatedProgress = userProgress.map(p => 
        p.challengeId === challengeId 
          ? { ...p, progress: Math.min(progress, 100) }
          : p
      );
      
      setUserProgress(updatedProgress);
      await saveUserProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const completeChallenge = async (challengeId: string, proofHash: string): Promise<void> => {
    try {
      const updatedProgress = userProgress.map(p => 
        p.challengeId === challengeId 
          ? { 
              ...p, 
              status: 'completed' as const,
              progress: 100,
              completionDate: new Date().toISOString(),
              proofSubmitted: true,
              proofHash,
            }
          : p
      );
      
      setUserProgress(updatedProgress);
      await saveUserProgress(updatedProgress);

      // Update user stats
      const completedChallenges = updatedProgress.filter(p => p.status === 'completed').length;
      const newStats: UserStats = {
        ...userStats,
        completedChallenges,
        totalRewards: `${completedChallenges * 50} XION`, // Simplified calculation
        rank: completedChallenges > 10 ? 'Expert' : completedChallenges > 5 ? 'Advanced' : 'Beginner',
      };
      
      setUserStats(newStats);
      await saveUserStats(newStats);

      Alert.alert('Challenge Completed!', 'Congratulations! Your proof has been verified.');
    } catch (error) {
      console.error('Error completing challenge:', error);
      Alert.alert('Error', 'Failed to complete challenge. Please try again.');
    }
  };

  const getUserProgress = async (): Promise<ChallengeProgress[]> => {
    return userProgress;
  };

  const getUserStats = async (): Promise<UserStats> => {
    return userStats;
  };

  const value: ChallengeContextType = {
    challenges,
    userProgress,
    userStats,
    isLoading,
    getChallenges,
    getChallengeById,
    startChallenge,
    updateProgress,
    completeChallenge,
    getUserProgress,
    getUserStats,
  };

  return (
    <ChallengeContext.Provider value={value}>
      {children}
    </ChallengeContext.Provider>
  );
};

// Hook to use challenge context
export const useChallenges = (): ChallengeContextType => {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenges must be used within a ChallengeProvider');
  }
  return context;
}; 