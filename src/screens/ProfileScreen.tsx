import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useXionAuth } from '../services/XionAuthService';
import { useChallenges } from '../services/ChallengeService';

interface ProfileSection {
  id: string;
  title: string;
  items: ProfileItem[];
}

interface ProfileItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated, disconnect } = useXionAuth();
  const { getUserStats } = useChallenges();
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const userStats = await getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await disconnect();
              // The navigation will automatically handle the auth state change
              // No need to manually navigate - the AppNavigator will handle it
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Coming Soon', 'Account deletion will be implemented in the next update.');
          }
        }
      ]
    );
  };

  const profileSections: ProfileSection[] = [
    {
      id: 'account',
      title: 'Account',
      items: [
        {
          id: 'wallet',
          title: 'Connected Wallet',
          subtitle: user?.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : 'Not connected',
          icon: '🔗',
          type: 'navigation',
          onPress: () => Alert.alert('Wallet', 'Wallet management coming soon!'),
        },
        {
          id: 'email',
          title: 'Email',
          subtitle: user?.email || 'Not set',
          icon: '📧',
          type: 'navigation',
          onPress: () => Alert.alert('Email', 'Email settings coming soon!'),
        },
        {
          id: 'security',
          title: 'Security Settings',
          subtitle: 'Password, 2FA, Biometric',
          icon: '🔒',
          type: 'navigation',
          onPress: () => Alert.alert('Security', 'Security settings coming soon!'),
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Get notified about new challenges',
          icon: '🔔',
          type: 'toggle',
          value: notificationsEnabled,
          onPress: () => setNotificationsEnabled(!notificationsEnabled),
        },
        {
          id: 'darkMode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme',
          icon: '🌙',
          type: 'toggle',
          value: darkModeEnabled,
          onPress: () => setDarkModeEnabled(!darkModeEnabled),
        },
        {
          id: 'biometric',
          title: 'Biometric Login',
          subtitle: 'Use fingerprint or face ID',
          icon: '👆',
          type: 'toggle',
          value: biometricEnabled,
          onPress: () => setBiometricEnabled(!biometricEnabled),
        },
      ],
    },
    {
      id: 'support',
      title: 'Support & Legal',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help with the app',
          icon: '❓',
          type: 'navigation',
          onPress: () => Alert.alert('Help', 'Help center coming soon!'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          icon: '💬',
          type: 'navigation',
          onPress: () => Alert.alert('Feedback', 'Feedback form coming soon!'),
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          subtitle: 'How we handle your data',
          icon: '📄',
          type: 'navigation',
          onPress: () => Alert.alert('Privacy', 'Privacy policy coming soon!'),
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          subtitle: 'App usage terms',
          icon: '📋',
          type: 'navigation',
          onPress: () => Alert.alert('Terms', 'Terms of service coming soon!'),
        },
      ],
    },
    {
      id: 'account_actions',
      title: 'Account Actions',
      items: [
        {
          id: 'logout',
          title: 'Logout',
          subtitle: 'Sign out of your account',
          icon: '🚪',
          type: 'action',
          onPress: handleLogout,
        },
        {
          id: 'delete',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          icon: '🗑️',
          type: 'action',
          onPress: handleDeleteAccount,
        },
      ],
    },
  ];

  const renderProfileItem = (item: ProfileItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.profileItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.profileItemLeft}>
        <Text style={styles.profileItemIcon}>{item.icon}</Text>
        <View style={styles.profileItemInfo}>
          <Text style={styles.profileItemTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.profileItemSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: '#767577', true: '#007AFF' }}
          thumbColor={item.value ? '#ffffff' : '#f4f3f4'}
        />
      )}
      
      {(item.type === 'navigation' || item.type === 'action') && (
        <Text style={styles.profileItemArrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>Login Required</Text>
        <Text style={styles.authSubtitle}>Please log in to view your profile</Text>
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
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{user.name?.[0] || user.email?.[0] || 'U'}</Text>
        </View>
        <Text style={styles.userName}>{user.name || user.email || 'User'}</Text>
        <Text style={styles.userRank}>{stats.rank || 'Beginner'}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.completedChallenges || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalRewards || '0 XION'}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.currentStreak || 0}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>
      </View>

      {/* Profile Sections */}
      {profileSections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map(renderProfileItem)}
          </View>
        </View>
      ))}

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>ProofPlay v1.0.0</Text>
        <Text style={styles.appDescription}>XION-powered challenge completion app</Text>
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
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  userRank: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#cccccc',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 10,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  profileItemInfo: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  profileItemSubtitle: {
    fontSize: 14,
    color: '#cccccc',
  },
  profileItemArrow: {
    fontSize: 18,
    color: '#cccccc',
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  appVersion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 5,
  },
  appDescription: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
});

export default ProfileScreen; 