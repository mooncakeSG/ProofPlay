import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, StyleSheet, View } from 'react-native';

// Import screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProofSubmissionScreen from './screens/ProofSubmissionScreen';
import ChallengeDetailScreen from './screens/ChallengeDetailScreen';
import LessonDetailScreen from './screens/LessonDetailScreen';

// Import components
import BottomNav from './components/BottomNav';

// Import XION SDK service
import { XionAuthProvider } from './services/XionAuthService';

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
};

export type AuthStackParamList = {
  Login: undefined;
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
    </Tab.Navigator>
  );
};

// Auth stack navigator
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
};

// Main App component
const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <XionAuthProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Auth" component={AuthStackNavigator} />
              <Stack.Screen name="Main" component={MainTabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </XionAuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
