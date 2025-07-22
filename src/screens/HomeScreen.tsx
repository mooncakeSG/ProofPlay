import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';

const { width } = Dimensions.get('window');

interface Challenge {
  id: string;
  title: string;
  level: 'Easy' | 'Medium' | 'Hard';
  category: string;
  image: string;
  status: 'trending' | 'newest' | 'in-progress' | 'completed';
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Complete 5K Run',
    level: 'Easy',
    category: 'Fitness',
    image: '🏃‍♂️',
    status: 'trending',
  },
  {
    id: '2',
    title: 'Learn React Native',
    level: 'Hard',
    category: 'Programming',
    image: '💻',
    status: 'newest',
  },
  {
    id: '3',
    title: 'Read 10 Books',
    level: 'Medium',
    category: 'Education',
    image: '📚',
    status: 'in-progress',
  },
  {
    id: '4',
    title: 'Create Digital Art',
    level: 'Medium',
    category: 'Creative',
    image: '🎨',
    status: 'completed',
  },
  {
    id: '5',
    title: 'Volunteer 20 Hours',
    level: 'Easy',
    category: 'Community',
    image: '🤝',
    status: 'trending',
  },
  {
    id: '6',
    title: 'Build Smart Contract',
    level: 'Hard',
    category: 'Blockchain',
    image: '⛓️',
    status: 'newest',
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'trending' | 'newest' | 'in-progress' | 'completed'>('trending');

  const filteredChallenges = mockChallenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = challenge.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const renderChallengeCard = ({ item }: { item: Challenge }) => (
    <TouchableOpacity
      style={styles.challengeCard}
      onPress={() => navigation.navigate('ChallengeDetail' as never, { challengeId: item.id } as never)}
    >
      <View style={styles.cardImageContainer}>
        <Text style={styles.cardImage}>{item.image}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.cardMeta}>
          <View style={[styles.levelTag, styles[`level${item.level}`]]}>
            <Text style={styles.levelText}>{item.level}</Text>
          </View>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const FilterTab = ({ title, value, isActive }: { title: string; value: typeof activeFilter; isActive: boolean }) => (
    <TouchableOpacity
      style={[styles.filterTab, isActive && styles.filterTabActive]}
      onPress={() => setActiveFilter(value)}
    >
      <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Challenges</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileEmoji}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search challenges..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FilterTab title="Trending" value="trending" isActive={activeFilter === 'trending'} />
        <FilterTab title="Newest" value="newest" isActive={activeFilter === 'newest'} />
        <FilterTab title="In Progress" value="in-progress" isActive={activeFilter === 'in-progress'} />
        <FilterTab title="Completed" value="completed" isActive={activeFilter === 'completed'} />
      </View>

      {/* Challenges Grid */}
      <FlatList
        data={filteredChallenges}
        renderItem={renderChallengeCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
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
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#999',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 120, // Account for bottom navigation
  },
  row: {
    justifyContent: 'space-between',
  },
  challengeCard: {
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
  },
  cardImageContainer: {
    height: 120,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    fontSize: 48,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 20,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelEasy: {
    backgroundColor: '#e8f5e8',
  },
  levelMedium: {
    backgroundColor: '#fff3cd',
  },
  levelHard: {
    backgroundColor: '#f8d7da',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen;
