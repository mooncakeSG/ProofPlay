// Mock React Native polyfills and modules
jest.mock('@react-native/js-polyfills/error-guard', () => ({
  setGlobalErrorHandler: jest.fn(),
  getGlobalErrorHandler: jest.fn(),
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock React Native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    NativeModules: {
      ...RN.NativeModules,
      RNGestureHandlerModule: {
        attachGestureHandler: jest.fn(),
        createGestureHandler: jest.fn(),
        dropGestureHandler: jest.fn(),
        updateGestureHandler: jest.fn(),
        getState: jest.fn(),
        sendEvent: jest.fn(),
        addListener: jest.fn(),
        removeListeners: jest.fn(),
      },
    },
  };
});

import 'react-native-gesture-handler/jestSetup';

// Mock expo modules
jest.mock('expo', () => ({
  ...jest.requireActual('expo'),
  SecureStore: {
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
  },
  Crypto: {
    digestStringAsync: jest.fn(),
  },
}));

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  getSupportedBiometryType: jest.fn(),
  getInternetCredentials: jest.fn(),
  setInternetCredentials: jest.fn(),
  resetInternetCredentials: jest.fn(),
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    All: 'All',
    Videos: 'Videos',
    Images: 'Images',
  },
  ImagePickerResult: {
    canceled: false,
    assets: [{ uri: 'test-uri' }],
  },
}));

// Mock expo-document-picker
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  documentDirectory: 'test-directory',
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper'); 