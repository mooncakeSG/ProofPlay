import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useXionAuth} from '../services/XionAuthService';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const {user, isAuthenticated, isLoading, connectWallet, connectSocial} =
    useXionAuth();

  // Navigate to main app if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Main' as never}],
      });
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
  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ProofPlay</Text>
        <Text style={styles.subtitle}>
          Complete challenges and submit proofs with XION
        </Text>
      </View>

      {/* Login Options */}
      <View style={styles.loginContainer}>
        {/* Wallet Connect Button */}
        <TouchableOpacity
          style={[styles.button, styles.walletButton]}
          onPress={handleWalletConnect}
          disabled={isLoading}>
          <Text style={styles.buttonText}>Connect Wallet</Text>
          <Text style={styles.buttonSubtext}>Use WalletConnect</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login Buttons */}
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={() => handleSocialLogin('google')}
          disabled={isLoading}>
          <Text style={[styles.buttonText, styles.googleButtonText]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.appleButton]}
          onPress={() => handleSocialLogin('apple')}
          disabled={isLoading}>
          <Text style={[styles.buttonText, styles.appleButtonText]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.facebookButton]}
          onPress={() => handleSocialLogin('facebook')}
          disabled={isLoading}>
          <Text style={[styles.buttonText, styles.facebookButtonText]}>
            Continue with Facebook
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletButton: {
    backgroundColor: '#007AFF',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  facebookButton: {
    backgroundColor: '#1877f2',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  buttonSubtext: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 2,
  },
  googleButtonText: {
    color: '#1a1a1a',
  },
  appleButtonText: {
    color: '#ffffff',
  },
  facebookButtonText: {
    color: '#ffffff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#666',
  },
  footer: {
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen; 