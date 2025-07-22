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
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../App';
import BottomNav from '../components/BottomNav';
import { useChallenges } from '../services/ChallengeService';

const { width } = Dimensions.get('window');

// Use the Challenge interface from the service
import { Challenge } from '../services/ChallengeService';

type HomeScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { challenges, userProgress, getChallenges, isLoading } = useChallenges();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'trending' | 'newest' | 'in-progress' | 'completed'>('trending');
  const [displayChallenges, setDisplayChallenges] = useState<Challenge[]>([]);

  // Load challenges on mount
  React.useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    const allChallenges = await getChallenges();
    setDisplayChallenges(allChallenges);
  };

  const filteredChallenges = displayChallenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Map challenge status to filter
    const userProgressItem = userProgress.find(p => p.challengeId === challenge.id);
    let challengeStatus = 'trending';
    if (userProgressItem) {
      if (userProgressItem.status === 'completed') challengeStatus = 'completed';
      else if (userProgressItem.status === 'in-progress') challengeStatus = 'in-progress';
    }
    
    const matchesFilter = challengeStatus === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const renderChallengeCard = ({ item }: { item: Challenge }) => (
    <TouchableOpacity
      style={styles.challengeCard}
      onPress={() => navigation.navigate('ChallengeDetail', { challengeId: item.id })}
    >
      <View style={styles.cardImageContainer}>
        <Text style={styles.cardImage}>{item.image}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.cardMeta}>
          <View style={[styles.levelTag, styles[`level${item.difficulty}`]]}>
            <Text style={styles.levelText}>{item.difficulty}</Text>
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
