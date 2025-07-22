import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useXionAuth } from '../services/XionAuthService';
import { useChallenges } from '../services/ChallengeService';

const FeatureTest: React.FC = () => {
  const { user, isAuthenticated, connectWallet, connectSocial, disconnect } = useXionAuth();
  const { challenges, userProgress, startChallenge, getUserStats } = useChallenges();

  const testWalletConnect = async () => {
    try {
      await connectWallet();
      Alert.alert('Success', 'Wallet connected successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to connect wallet');
    }
  };

  const testSocialLogin = async () => {
    try {
      await connectSocial('google');
      Alert.alert('Success', 'Social login successful!');
    } catch (error) {
      Alert.alert('Error', 'Failed to connect with Google');
    }
  };

  const testStartChallenge = async () => {
    if (challenges.length > 0) {
      try {
        await startChallenge(challenges[0].id);
        Alert.alert('Success', 'Challenge started successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to start challenge');
      }
    }
  };

  const testGetStats = async () => {
    try {
      const stats = await getUserStats();
      Alert.alert('User Stats', `Completed: ${stats.completedChallenges}\nRewards: ${stats.totalRewards}\nRank: ${stats.rank}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to get user stats');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Feature Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication Status</Text>
        <Text style={styles.statusText}>
          Authenticated: {isAuthenticated ? 'Yes' : 'No'}
        </Text>
        {user && (
          <Text style={styles.statusText}>
            User: {user.name || user.email || user.address}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication Tests</Text>
        <TouchableOpacity style={styles.button} onPress={testWalletConnect}>
          <Text style={styles.buttonText}>Test Wallet Connect</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testSocialLogin}>
          <Text style={styles.buttonText}>Test Social Login</Text>
        </TouchableOpacity>
        
        {isAuthenticated && (
          <TouchableOpacity style={styles.button} onPress={disconnect}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Challenge Tests</Text>
        <Text style={styles.statusText}>
          Available Challenges: {challenges.length}
        </Text>
        <Text style={styles.statusText}>
          User Progress: {userProgress.length} challenges
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={testStartChallenge}>
          <Text style={styles.buttonText}>Start First Challenge</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testGetStats}>
          <Text style={styles.buttonText}>Get User Stats</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Challenge List</Text>
        {challenges.slice(0, 3).map((challenge) => (
          <View key={challenge.id} style={styles.challengeItem}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeCategory}>{challenge.category}</Text>
            <Text style={styles.challengeReward}>{challenge.reward}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  challengeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  challengeCategory: {
    fontSize: 14,
    color: '#cccccc',
    marginTop: 2,
  },
  challengeReward: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
});

export default FeatureTest; 