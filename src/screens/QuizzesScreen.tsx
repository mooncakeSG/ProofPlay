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
import { Ionicons } from '@expo/vector-icons';

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: number;
  timeLimit: number; // in minutes
  reward: string;
  completed: boolean;
  score?: number;
  image: string;
}

const QuizzesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated } = useXionAuth();
  const { getUserStats } = useChallenges();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Blockchain', 'Programming', 'Fitness', 'Education', 'Creative'];

  // Mock quiz data
  const mockQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'XION Blockchain Basics',
      description: 'Test your knowledge of XION blockchain fundamentals',
      category: 'Blockchain',
      difficulty: 'Easy',
      questions: 10,
      timeLimit: 15,
      reward: '25 XION',
      completed: false,
      image: 'link',
    },
    {
      id: '2',
      title: 'zkTLS Protocol',
      description: 'Learn about zero-knowledge TLS and proof verification',
      category: 'Blockchain',
      difficulty: 'Hard',
      questions: 15,
      timeLimit: 20,
      reward: '50 XION',
      completed: false,
      image: 'lock-closed',
    },
    {
      id: '3',
      title: 'React Native Development',
      description: 'Test your React Native and mobile development skills',
      category: 'Programming',
      difficulty: 'Medium',
      questions: 12,
      timeLimit: 18,
      reward: '35 XION',
      completed: false,
      image: 'phone-portrait',
    },
    {
      id: '4',
      title: 'Fitness Fundamentals',
      description: 'Quiz on health, nutrition, and exercise basics',
      category: 'Fitness',
      difficulty: 'Easy',
      questions: 8,
      timeLimit: 12,
      reward: '20 XION',
      completed: false,
      image: 'fitness',
    },
    {
      id: '5',
      title: 'Cryptocurrency Trading',
      description: 'Advanced quiz on crypto trading strategies',
      category: 'Blockchain',
      difficulty: 'Hard',
      questions: 20,
      timeLimit: 25,
      reward: '75 XION',
      completed: false,
      image: 'trending-up',
    },
    {
      id: '6',
      title: 'Digital Art Techniques',
      description: 'Test your knowledge of digital art and design',
      category: 'Creative',
      difficulty: 'Medium',
      questions: 10,
      timeLimit: 15,
      reward: '30 XION',
      completed: false,
      image: 'color-palette',
    },
  ];

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQuizzes(mockQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      Alert.alert('Error', 'Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuizzes = selectedCategory === 'All' 
    ? quizzes 
    : quizzes.filter(quiz => quiz.category === selectedCategory);

  const handleStartQuiz = (quiz: Quiz) => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please log in to take quizzes');
      return;
    }

    Alert.alert(
      'Start Quiz',
      `Are you ready to start "${quiz.title}"?\n\nQuestions: ${quiz.questions}\nTime Limit: ${quiz.timeLimit} minutes\nReward: ${quiz.reward}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            // Navigate to quiz screen (to be implemented)
            Alert.alert('Coming Soon', 'Quiz functionality will be implemented in the next update!');
          }
        }
      ]
    );
  };

  const renderQuizCard = ({ item }: { item: Quiz }) => {
    return (
      <TouchableOpacity
        style={[styles.quizCard, item.completed && styles.completedQuiz]}
        onPress={() => handleStartQuiz(item)}
        activeOpacity={0.8}
      >
        <View style={styles.quizHeader}>
          <View style={styles.quizIconContainer}>
            <Ionicons name={item.image as any} size={32} color="#007AFF" />
          </View>
          <View style={styles.quizInfo}>
            <Text style={styles.quizTitle}>{item.title}</Text>
            <Text style={styles.quizDescription}>{item.description}</Text>
            <View style={styles.quizMeta}>
              <Text style={styles.quizDifficulty}>{item.difficulty}</Text>
              <Text style={styles.quizQuestions}>{item.questions} questions</Text>
              <Text style={styles.quizTime}>{item.timeLimit}m</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.quizFooter}>
          <Text style={styles.quizReward}>{item.reward}</Text>
          {item.completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completed</Text>
              {item.score && <Text style={styles.scoreText}>{item.score}%</Text>}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === category && styles.categoryTextActive
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading quizzes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quizzes</Text>
        <Text style={styles.headerSubtitle}>Test your knowledge, earn rewards</Text>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(renderCategoryButton)}
      </ScrollView>

      {/* Quizzes List */}
      <FlatList
        data={filteredQuizzes}
        renderItem={renderQuizCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.quizzesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No quizzes available in this category</Text>
          </View>
        }
      />
    </View>
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
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  quizzesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  quizCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  completedQuiz: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  quizHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  quizIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  quizDescription: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 10,
    lineHeight: 20,
  },
  quizMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  quizDifficulty: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  quizQuestions: {
    fontSize: 12,
    color: '#cccccc',
  },
  quizTime: {
    fontSize: 12,
    color: '#cccccc',
  },
  quizFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizReward: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  completedBadge: {
    alignItems: 'center',
  },
  completedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 10,
    color: '#4CAF50',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#cccccc',
    fontSize: 16,
  },
});

export default QuizzesScreen; 