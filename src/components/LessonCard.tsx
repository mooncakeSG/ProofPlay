import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface LessonCardProps {
  title: string;
  level: 'Easy' | 'Medium' | 'Hard';
  image: string;
  onClick: () => void;
  category?: string;
  progress?: number;
  isActive?: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({
  title,
  level,
  image,
  onClick,
  category,
  progress = 0,
  isActive = false,
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Easy':
        return '#4CAF50';
      case 'Medium':
        return '#FF9800';
      case 'Hard':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getLevelBackground = (level: string) => {
    switch (level) {
      case 'Easy':
        return '#E8F5E8';
      case 'Medium':
        return '#FFF3CD';
      case 'Hard':
        return '#F8D7DA';
      default:
        return '#F0F0F0';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isActive && styles.cardActive,
      ]}
      onPress={onClick}
      activeOpacity={0.8}
    >
      {/* Card Image */}
      <View style={styles.imageContainer}>
        <Text style={styles.imageText}>{image}</Text>
        {progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        )}
      </View>

      {/* Card Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        
        <View style={styles.metaContainer}>
          <View style={[
            styles.levelTag,
            { backgroundColor: getLevelBackground(level) }
          ]}>
            <Text style={[
              styles.levelText,
              { color: getLevelColor(level) }
            ]}>
              {level}
            </Text>
          </View>
          
          {category && (
            <Text style={styles.categoryText}>{category}</Text>
          )}
        </View>

        {/* Progress Indicator */}
        {progress > 0 && (
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>{progress}% Complete</Text>
          </View>
        )}
      </View>

      {/* Active Indicator */}
      {isActive && (
        <View style={styles.activeIndicator}>
          <View style={styles.activeDot} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: (width - 40) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  cardActive: {
    shadowColor: '#007AFF',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  imageContainer: {
    height: 120,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageText: {
    fontSize: 48,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#e0e0e0',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  progressInfo: {
    marginTop: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
});

export default LessonCard; 