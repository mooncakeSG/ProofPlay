import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useXionAuth } from '../services/XionAuthService';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated, isLoading, connectWallet, connectSocial } =
    useXionAuth();

  // Navigate to main app if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // The navigation will automatically handle the auth state change
      // No need to manually navigate - the AppNavigator will handle it
    }
  }, [isAuthenticated, user, navigation]);

  // Handle wallet connection
  const handleWalletConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  // Handle social login
  const handleSocialLogin = async (
    provider: 'google' | 'apple' | 'facebook'
  ) => {
    try {
      await connectSocial(provider);
    } catch (error) {
      console.error('Social login error:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Connecting...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Hero Section */}
      <View style={styles.heroSection}>
        {/* Background Gradient Effect */}
        <View style={styles.backgroundGradient} />
        
        {/* App Logo/Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>🎯</Text>
          </View>
        </View>

        {/* Main Title */}
        <Text style={styles.mainTitle}>ProofPlay</Text>
        <Text style={styles.subtitle}>
          Complete challenges and earn rewards with XION
        </Text>

        {/* Category Icons */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryIcon}>
            <Text style={styles.categoryEmoji}>🏃‍♂️</Text>
          </View>
          <View style={styles.categoryIcon}>
            <Text style={styles.categoryEmoji}>📚</Text>
          </View>
          <View style={styles.categoryIcon}>
            <Text style={styles.categoryEmoji}>🎨</Text>
          </View>
          <View style={styles.categoryIcon}>
            <Text style={styles.categoryEmoji}>💻</Text>
          </View>
        </View>
      </View>

      {/* Login Options */}
      <View style={styles.loginContainer}>
        {/* Social Login Buttons */}
        <TouchableOpacity
          style={[styles.button, styles.appleButton]}
          onPress={() => handleSocialLogin('apple')}
          disabled={isLoading}
        >
          <Text style={styles.appleButtonText}>🍎</Text>
          <Text style={[styles.buttonText, styles.appleButtonText]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={() => handleSocialLogin('google')}
          disabled={isLoading}
        >
          <Text style={styles.googleButtonText}>🔍</Text>
          <Text style={[styles.buttonText, styles.googleButtonText]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

                       <TouchableOpacity
                 style={[styles.button, styles.emailButton]}
                 onPress={() => navigation.navigate('EmailAuth' as never)}
                 disabled={isLoading}
               >
                 <Text style={styles.emailButtonText}>✉️</Text>
                 <Text style={[styles.buttonText, styles.emailButtonText]}>
                   Continue with Email
                 </Text>
               </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Wallet Connect Button */}
        <TouchableOpacity
          style={[styles.button, styles.walletButton]}
          onPress={handleWalletConnect}
          disabled={isLoading}
        >
          <Text style={styles.walletButtonText}>🔗</Text>
          <Text style={styles.buttonText}>Connect Wallet</Text>
          <Text style={styles.buttonSubtext}>Use WalletConnect</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    marginTop: 16,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a1a',
    opacity: 0.9,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  loginContainer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSubtext: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
  },
  appleButton: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#333333',
  },
  appleButtonText: {
    color: '#ffffff',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  googleButtonText: {
    color: '#000000',
  },
  emailButton: {
    backgroundColor: '#007AFF',
  },
  emailButtonText: {
    color: '#ffffff',
  },
  walletButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  walletButtonText: {
    color: '#007AFF',
    fontSize: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: '#cccccc',
    fontSize: 14,
    marginHorizontal: 16,
  },
});

export default LoginScreen;
