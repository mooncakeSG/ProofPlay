import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native';

// Import screens
import LoginScreen from './screens/LoginScreen';
import EmailAuthScreen from './screens/EmailAuthScreen';
import HomeScreen from './screens/HomeScreen';
import ProofSubmissionScreen from './screens/ProofSubmissionScreen';
import ChallengeDetailScreen from './screens/ChallengeDetailScreen';
import LessonDetailScreen from './screens/LessonDetailScreen';
import FeatureTest from './components/FeatureTest';

// Import components
import BottomNav from './components/BottomNav';

// Import XION SDK service
import { XionAuthProvider, useXionAuth } from './services/XionAuthService';
import { ChallengeProvider } from './services/ChallengeService';

// Define navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Quizzes: undefined;
  Progress: undefined;
  Profile: undefined;
  SubmitProof: undefined;
  ChallengeDetail: { challengeId: string };
  LessonDetail: { lessonId: string };
  FeatureTest: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  EmailAuth: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

// Placeholder screens for new tabs
const QuizzesScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Quizzes</Text>
    <Text style={{ fontSize: 16, color: '#666', marginTop: 8 }}>Coming Soon</Text>
  </View>
);

const ProgressScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Progress</Text>
    <Text style={{ fontSize: 16, color: '#666', marginTop: 8 }}>Track your achievements</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Profile</Text>
    <Text style={{ fontSize: 16, color: '#666', marginTop: 8 }}>Your account settings</Text>
  </View>
);

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar, we'll use custom BottomNav
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Quizzes" component={QuizzesScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="SubmitProof" component={ProofSubmissionScreen} />
      <Tab.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
      <Tab.Screen name="LessonDetail" component={LessonDetailScreen} />
      <Tab.Screen name="FeatureTest" component={FeatureTest} />
    </Tab.Navigator>
  );
};

// Auth stack navigator
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="EmailAuth" component={EmailAuthScreen} />
    </AuthStack.Navigator>
  );
};

// Main App component
const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <XionAuthProvider>
          <ChallengeProvider>
            <AppNavigator />
          </ChallengeProvider>
        </XionAuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

// App Navigator with authentication logic
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useXionAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
  },
});

export default App;
