import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useXionAuth} from '../services/XionAuthService';

// Challenge interface
interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  reward: string;
  deadline: string;
  participants: number;
}

// Hardcoded challenges data
const CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Complete a 5K Run',
    description: 'Run 5 kilometers and submit proof of completion. Track your route using any fitness app.',
    category: 'Fitness',
    difficulty: 'Easy',
    reward: '50 XION tokens',
    deadline: '2024-02-15',
    participants: 127,
  },
  {
    id: '2',
    title: 'Learn a New Programming Language',
    description: 'Complete a beginner course in Python, JavaScript, or Rust. Submit your certificate or final project.',
    category: 'Education',
    difficulty: 'Medium',
    reward: '100 XION tokens',
    deadline: '2024-03-01',
    participants: 89,
  },
  {
    id: '3',
    title: 'Volunteer for 10 Hours',
    description: 'Volunteer at a local charity or community organization. Document your hours and activities.',
    category: 'Community',
    difficulty: 'Medium',
    reward: '75 XION tokens',
    deadline: '2024-02-28',
    participants: 45,
  },
  {
    id: '4',
    title: 'Build a Smart Contract',
    description: 'Create and deploy a simple smart contract on XION blockchain. Include basic functionality like token transfer.',
    category: 'Blockchain',
    difficulty: 'Hard',
    reward: '200 XION tokens',
    deadline: '2024-03-15',
    participants: 23,
  },
  {
    id: '5',
    title: 'Read 5 Books in a Month',
    description: 'Read 5 books from different genres and submit book reviews or reading logs.',
    category: 'Education',
    difficulty: 'Medium',
    reward: '80 XION tokens',
    deadline: '2024-02-29',
    participants: 67,
  },
  {
    id: '6',
    title: 'Create Digital Art',
    description: 'Create an original digital artwork using any software. Submit the final piece and process screenshots.',
    category: 'Creative',
    difficulty: 'Easy',
    reward: '60 XION tokens',
    deadline: '2024-02-20',
    participants: 156,
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const {user, disconnect} = useXionAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  // Handle challenge selection
  const handleChallengePress = (challenge: Challenge) => {
    navigation.navigate('ChallengeDetail' as never, {
      challengeId: challenge.id,
    } as never);
  };

  // Handle refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Render challenge item
  const renderChallengeItem = ({item}: {item: Challenge}) => (
    <TouchableOpacity
      style={styles.challengeCard}
      onPress={() => handleChallengePress(item)}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>{item.title}</Text>
        <View style={[styles.difficultyBadge, styles[`${item.difficulty.toLowerCase()}Badge`]]}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>
      </View>
      
      <Text style={styles.challengeDescription}>{item.description}</Text>
      
      <View style={styles.challengeFooter}>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardText}>{item.reward}</Text>
        </View>
      </View>
      
      <View style={styles.challengeMeta}>
        <Text style={styles.participantsText}>{item.participants} participants</Text>
        <Text style={styles.deadlineText}>Deadline: {item.deadline}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.userText}>
            {user?.name || user?.address?.slice(0, 8) + '...' || 'User'}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Challenges List */}
      <FlatList
        data={CHALLENGES}
        renderItem={renderChallengeItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  userText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  challengeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  easyBadge: {
    backgroundColor: '#d4edda',
  },
  mediumBadge: {
    backgroundColor: '#fff3cd',
  },
  hardBadge: {
    backgroundColor: '#f8d7da',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  rewardContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rewardText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  challengeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 12,
    color: '#999',
  },
  deadlineText: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen; 