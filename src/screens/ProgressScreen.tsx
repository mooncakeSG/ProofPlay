import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useXionAuth } from '../services/XionAuthService';
import { useChallenges } from '../services/ChallengeService';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: string;
}

interface ProgressStats {
  totalChallenges: number;
  completedChallenges: number;
  totalRewards: string;
  currentStreak: number;
  rank: string;
  averageScore: number;
  totalTimeSpent: number; // in hours
  weeklyProgress: number;
}

const ProgressScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated } = useXionAuth();
  const { userProgress, getUserStats } = useChallenges();
  const [stats, setStats] = useState<ProgressStats>({
    totalChallenges: 0,
    completedChallenges: 0,
    totalRewards: '0 XION',
    currentStreak: 0,
    rank: 'Beginner',
    averageScore: 0,
    totalTimeSpent: 0,
    weeklyProgress: 0,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setIsLoading(true);
    try {
      // Load user stats
      const userStats = await getUserStats();
      setStats({
        totalChallenges: userStats.totalChallenges,
        completedChallenges: userStats.completedChallenges,
        totalRewards: userStats.totalRewards,
        currentStreak: userStats.currentStreak,
        rank: userStats.rank,
        averageScore: 85, // Mock data
        totalTimeSpent: 12, // Mock data
        weeklyProgress: 75, // Mock data
      });

      // Load achievements
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first challenge',
          icon: '🎯',
          unlocked: userStats.completedChallenges > 0,
          progress: Math.min(userStats.completedChallenges, 1),
          maxProgress: 1,
          reward: '10 XION',
        },
        {
          id: '2',
          title: 'Challenge Master',
          description: 'Complete 10 challenges',
          icon: '🏆',
          unlocked: userStats.completedChallenges >= 10,
          progress: Math.min(userStats.completedChallenges, 10),
          maxProgress: 10,
          reward: '100 XION',
        },
        {
          id: '3',
          title: 'Streak Champion',
          description: 'Maintain a 7-day streak',
          icon: '🔥',
          unlocked: userStats.currentStreak >= 7,
          progress: Math.min(userStats.currentStreak, 7),
          maxProgress: 7,
          reward: '50 XION',
        },
        {
          id: '4',
          title: 'Blockchain Expert',
          description: 'Complete 5 blockchain challenges',
          icon: '🔗',
          unlocked: false,
          progress: 2,
          maxProgress: 5,
          reward: '200 XION',
        },
        {
          id: '5',
          title: 'Fitness Enthusiast',
          description: 'Complete 3 fitness challenges',
          icon: '💪',
          unlocked: false,
          progress: 1,
          maxProgress: 3,
          reward: '75 XION',
        },
        {
          id: '6',
          title: 'Perfect Score',
          description: 'Get 100% on any quiz',
          icon: '⭐',
          unlocked: false,
          progress: 0,
          maxProgress: 1,
          reward: '25 XION',
        },
      ];
      setAchievements(mockAchievements);
    } catch (error) {
      console.error('Error loading progress data:', error);
      Alert.alert('Error', 'Failed to load progress data');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatCard = (title: string, value: string | number, subtitle?: string, icon?: string) => (
    <View style={styles.statCard}>
      {icon && <Text style={styles.statIcon}>{icon}</Text>}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderAchievementCard = ({ item }: { item: Achievement }) => (
    <TouchableOpacity
      style={[styles.achievementCard, item.unlocked && styles.unlockedAchievement]}
      onPress={() => {
        Alert.alert(
          item.title,
          `${item.description}\n\nProgress: ${item.progress}/${item.maxProgress}\nReward: ${item.reward}`,
          [{ text: 'OK' }]
        );
      }}
      activeOpacity={0.8}
    >
      <View style={styles.achievementHeader}>
        <Text style={[styles.achievementIcon, item.unlocked && styles.unlockedIcon]}>
          {item.icon}
        </Text>
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementTitle}>{item.title}</Text>
          <Text style={styles.achievementDescription}>{item.description}</Text>
        </View>
      </View>
      
      <View style={styles.achievementProgress}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(item.progress / item.maxProgress) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {item.progress}/{item.maxProgress}
        </Text>
      </View>
      
      {item.unlocked && (
        <View style={styles.unlockedBadge}>
          <Text style={styles.unlockedText}>✓ Unlocked</Text>
          <Text style={styles.rewardText}>{item.reward}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderProgressItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.progressItem}
      onPress={() => navigation.navigate('ChallengeDetail' as never, { challengeId: item.challengeId } as never)}
    >
      <View style={styles.progressItemHeader}>
        <Text style={styles.progressItemTitle}>{item.title || 'Challenge'}</Text>
        <Text style={styles.progressItemStatus}>{item.status}</Text>
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${item.progress}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressPercentage}>{item.progress}%</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading progress...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>Login Required</Text>
        <Text style={styles.authSubtitle}>Please log in to view your progress</Text>
        <TouchableOpacity 
          style={styles.authButton}
          onPress={() => navigation.navigate('Auth' as never)}
        >
          <Text style={styles.authButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress</Text>
        <Text style={styles.headerSubtitle}>Track your achievements and growth</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {renderStatCard('Completed', stats.completedChallenges, 'challenges', '✅')}
          {renderStatCard('Total Rewards', stats.totalRewards, 'earned', '💰')}
          {renderStatCard('Current Streak', stats.currentStreak, 'days', '🔥')}
          {renderStatCard('Rank', stats.rank, 'level', '🏅')}
        </View>
      </View>

      {/* Weekly Progress */}
      <View style={styles.weeklyContainer}>
        <Text style={styles.sectionTitle}>Weekly Progress</Text>
        <View style={styles.weeklyProgress}>
          <View style={styles.weeklyProgressBar}>
            <View 
              style={[
                styles.weeklyProgressFill, 
                { width: `${stats.weeklyProgress}%` }
              ]} 
            />
          </View>
          <Text style={styles.weeklyProgressText}>{stats.weeklyProgress}%</Text>
        </View>
      </View>

      {/* Current Progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.sectionTitle}>Current Challenges</Text>
        {userProgress.length > 0 ? (
          <FlatList
            data={userProgress.slice(0, 3)}
            renderItem={renderProgressItem}
            keyExtractor={(item) => item.challengeId}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active challenges</Text>
            <TouchableOpacity 
              style={styles.startChallengeButton}
              onPress={() => navigation.navigate('Home' as never)}
            >
              <Text style={styles.startChallengeButtonText}>Start a Challenge</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Achievements */}
      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <FlatList
          data={achievements}
          renderItem={renderAchievementCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.achievementsList}
        />
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  authButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  authButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#cccccc',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  statsContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
  weeklyContainer: {
    padding: 20,
  },
  weeklyProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  weeklyProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  weeklyProgressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  weeklyProgressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    minWidth: 40,
  },
  progressContainer: {
    padding: 20,
  },
  progressItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  progressItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressItemStatus: {
    fontSize: 12,
    color: '#007AFF',
    textTransform: 'uppercase',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#cccccc',
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: '#cccccc',
    fontSize: 16,
    marginBottom: 15,
  },
  startChallengeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startChallengeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  achievementsContainer: {
    padding: 20,
  },
  achievementsList: {
    gap: 15,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  unlockedAchievement: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  achievementHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 15,
    opacity: 0.5,
  },
  unlockedIcon: {
    opacity: 1,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 12,
    color: '#cccccc',
    minWidth: 30,
  },
  unlockedBadge: {
    alignItems: 'center',
  },
  unlockedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  rewardText: {
    fontSize: 10,
    color: '#FFD700',
  },
  bottomSpacer: {
    height: 100,
  },
});

export default ProgressScreen; 