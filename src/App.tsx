import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, StyleSheet } from 'react-native';

// Import screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProofSubmissionScreen from './screens/ProofSubmissionScreen';
import ChallengeDetailScreen from './screens/ChallengeDetailScreen';

// Import XION SDK service
import { XionAuthProvider } from './services/XionAuthService';

// Define navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  SubmitProof: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  ChallengeDetail: { challengeId: string };
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();

// Tab icon components
const ChallengesIcon = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ color, fontSize: size }}>📋</Text>
);

const SubmitProofIcon = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ color, fontSize: size }}>📤</Text>
);

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Challenges',
          tabBarIcon: ChallengesIcon,
        }}
      />
      <Tab.Screen
        name="SubmitProof"
        component={ProofSubmissionScreen}
        options={{
          tabBarLabel: 'Submit Proof',
          tabBarIcon: SubmitProofIcon,
        }}
      />
    </Tab.Navigator>
  );
};

// Home stack navigator
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Challenges' }}
      />
      <HomeStack.Screen
        name="ChallengeDetail"
        component={ChallengeDetailScreen}
        options={{ title: 'Challenge Details' }}
      />
    </HomeStack.Navigator>
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
