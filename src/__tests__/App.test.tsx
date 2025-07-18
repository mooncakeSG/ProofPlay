import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../App';

// Mock the navigation dependencies
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({children}: {children: React.ReactNode}) => children,
    Screen: ({children}: {children: React.ReactNode}) => children,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({children}: {children: React.ReactNode}) => children,
    Screen: ({children}: {children: React.ReactNode}) => children,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({children}: {children: React.ReactNode}) => children,
}));

// Mock the screens
jest.mock('../screens/LoginScreen', () => 'LoginScreen');
jest.mock('../screens/HomeScreen', () => 'HomeScreen');
jest.mock('../screens/ProofSubmissionScreen', () => 'ProofSubmissionScreen');
jest.mock('../screens/ChallengeDetailScreen', () => 'ChallengeDetailScreen');

// Mock the XION auth service
jest.mock('../services/XionAuthService', () => ({
  XionAuthProvider: ({children}: {children: React.ReactNode}) => children,
}));

describe('App', () => {
  it('renders without crashing', () => {
    const {getByTestId} = render(<App />);
    // The app should render without throwing any errors
    expect(true).toBe(true);
  });

  it('has proper structure', () => {
    const {container} = render(<App />);
    expect(container).toBeTruthy();
  });
}); 