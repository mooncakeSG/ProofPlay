import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useXionAuth } from '../services/XionAuthService';

// Challenge interface (same as HomeScreen)
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

// Hardcoded challenges data (same as HomeScreen)
const CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Complete a 5K Run',
    description:
      'Run 5 kilometers and submit proof of completion. Track your route using any fitness app.',
    category: 'Fitness',
    difficulty: 'Easy',
    reward: '50 XION tokens',
    deadline: '2024-02-15',
    participants: 127,
  },
  {
    id: '2',
    title: 'Learn a New Programming Language',
    description:
      'Complete a beginner course in Python, JavaScript, or Rust. Submit your certificate or final project.',
    category: 'Education',
    difficulty: 'Medium',
    reward: '100 XION tokens',
    deadline: '2024-03-01',
    participants: 89,
  },
  {
    id: '3',
    title: 'Volunteer for 10 Hours',
    description:
      'Volunteer at a local charity or community organization. Document your hours and activities.',
    category: 'Community',
    difficulty: 'Medium',
    reward: '75 XION tokens',
    deadline: '2024-02-28',
    participants: 45,
  },
  {
    id: '4',
    title: 'Build a Smart Contract',
    description:
      'Create and deploy a simple smart contract on XION blockchain. Include basic functionality like token transfer.',
    category: 'Blockchain',
    difficulty: 'Hard',
    reward: '200 XION tokens',
    deadline: '2024-03-15',
    participants: 23,
  },
  {
    id: '5',
    title: 'Read 5 Books in a Month',
    description:
      'Read 5 books from different genres and submit book reviews or reading logs.',
    category: 'Education',
    difficulty: 'Medium',
    reward: '80 XION tokens',
    deadline: '2024-02-29',
    participants: 67,
  },
  {
    id: '6',
    title: 'Create Digital Art',
    description:
      'Create an original digital artwork using any software. Submit the final piece and process screenshots.',
    category: 'Creative',
    difficulty: 'Easy',
    reward: '60 XION tokens',
    deadline: '2024-02-20',
    participants: 156,
  },
];

const ChallengeDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useXionAuth();

  // Get challenge ID from route params
  const { challengeId } = route.params as { challengeId: string };

  // Find the challenge by ID
  const challenge = CHALLENGES.find((c) => c.id === challengeId);

  // Handle submit proof navigation
  const handleSubmitProof = () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit a proof');
      return;
    }

    navigation.navigate('SubmitProof' as never);
  };

  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  if (!challenge) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Challenge not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Challenge Content */}
      <View style={styles.content}>
        {/* Title and Badge */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{challenge.title}</Text>
          <View
            style={[
              styles.difficultyBadge,
              styles[`${challenge.difficulty.toLowerCase()}Badge`],
            ]}
          >
            <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
          </View>
        </View>

        {/* Category and Reward */}
        <View style={styles.metaContainer}>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Category</Text>
            <Text style={styles.categoryText}>{challenge.category}</Text>
          </View>
          <View style={styles.rewardContainer}>
            <Text style={styles.rewardLabel}>Reward</Text>
            <Text style={styles.rewardText}>{challenge.reward}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{challenge.description}</Text>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirementsList}>
            <Text style={styles.requirementItem}>
              • Complete the challenge as described
            </Text>
            <Text style={styles.requirementItem}>
              • Submit clear proof of completion
            </Text>
            <Text style={styles.requirementItem}>
              • Meet the deadline: {challenge.deadline}
            </Text>
            <Text style={styles.requirementItem}>
              • Proof will be verified using XION zkTLS
            </Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{challenge.participants}</Text>
              <Text style={styles.statLabel}>Participants</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{challenge.deadline}</Text>
              <Text style={styles.statLabel}>Deadline</Text>
            </View>
          </View>
        </View>

        {/* Submit Proof Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitProof}
        >
          <Text style={styles.submitButtonText}>Submit Proof</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
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
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryContainer: {
    flex: 1,
    marginRight: 12,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  rewardContainer: {
    flex: 1,
    marginLeft: 12,
  },
  rewardLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  requirementsList: {
    marginLeft: 8,
  },
  requirementItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default ChallengeDetailScreen;
