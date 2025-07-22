import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface LessonDetailProps {
  route: {
    params: {
      lessonId: string;
    };
  };
}

const LessonDetailScreen: React.FC<LessonDetailProps> = ({ route }) => {
  const navigation = useNavigation();
  const { lessonId } = route.params;
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Mock lesson data
  const lesson = {
    id: lessonId,
    title: 'Complete 5K Run Challenge',
    description: 'Run 5 kilometers and submit proof of completion. Track your route using any fitness app and share your achievement with the community.',
    category: 'Fitness',
    level: 'Easy',
    image: '🏃‍♂️',
    images: ['🏃‍♂️', '🎯', '🏆', '📱'],
    duration: '30-45 minutes',
    participants: 127,
    reward: '50 XION tokens',
    requirements: [
      'Any fitness tracking app',
      'GPS-enabled device',
      'Comfortable running shoes',
      'Safe running route',
    ],
  };

  const difficulties = ['Easy', 'Medium', 'Hard'] as const;

  const handleStartLesson = () => {
    // Navigate to lesson start or proof submission
    navigation.navigate('ProofSubmission' as never, { lessonId } as never);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lesson Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <View style={styles.heroImage}>
            <Text style={styles.heroImageText}>{lesson.image}</Text>
          </View>
          
          {/* Image Carousel Dots */}
          <View style={styles.carouselDots}>
            {lesson.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === 0 && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title and Category */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{lesson.title}</Text>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{lesson.category}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{lesson.description}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{lesson.participants}</Text>
              <Text style={styles.statLabel}>Participants</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{lesson.duration}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{lesson.reward}</Text>
              <Text style={styles.statLabel}>Reward</Text>
            </View>
          </View>

          {/* Difficulty Selector */}
          <View style={styles.difficultySection}>
            <Text style={styles.sectionTitle}>Select Difficulty</Text>
            <View style={styles.difficultyContainer}>
              {difficulties.map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.difficultyButton,
                    selectedDifficulty === difficulty && styles.difficultyButtonActive,
                  ]}
                  onPress={() => setSelectedDifficulty(difficulty)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      selectedDifficulty === difficulty && styles.difficultyTextActive,
                    ]}
                  >
                    {difficulty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Requirements */}
          <View style={styles.requirementsSection}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {lesson.requirements.map((requirement, index) => (
              <View key={index} style={styles.requirementItem}>
                <Text style={styles.requirementBullet}>•</Text>
                <Text style={styles.requirementText}>{requirement}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Start Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartLesson}>
          <Text style={styles.startButtonText}>Start Lesson</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  heroImageText: {
    fontSize: 80,
  },
  carouselDots: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  activeDot: {
    backgroundColor: '#007AFF',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 16,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  difficultySection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  difficultyButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  difficultyTextActive: {
    color: '#ffffff',
  },
  requirementsSection: {
    marginBottom: 32,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requirementBullet: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 8,
    marginTop: 2,
  },
  requirementText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default LessonDetailScreen; 