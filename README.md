# ProofPlay - React Native App with XION Integration

A React Native application that integrates XION's Mobile Developer Kit (Dave) for user authentication and proof verification using zkTLS technology.

## Features

- **XION Authentication**: Wallet Connect and social login integration
- **Challenge Feed**: Browse hardcoded challenges with titles and descriptions
- **Proof Submission**: Upload images or documents as proof of challenge completion
- **zkTLS Verification**: XION SDK integration for cryptographic proof verification
- **Modern UI**: Clean, responsive design with React Navigation

## Project Structure

```
ProofPlay/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx          # Authentication screen
│   │   ├── HomeScreen.tsx           # Challenge feed
│   │   ├── ChallengeDetailScreen.tsx # Challenge details
│   │   └── ProofSubmissionScreen.tsx # Proof upload & verification
│   ├── services/
│   │   └── XionAuthService.tsx      # XION SDK integration
│   └── App.tsx                      # Main app component
├── package.json                     # Dependencies
├── index.js                         # App entry point
└── README.md                        # This file
```

## Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- XION Mobile Developer Kit (Dave)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProofPlay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install React Native CLI globally** (if not already installed)
   ```bash
   npm install -g react-native-cli
   ```

4. **iOS Setup** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

## Configuration

### XION SDK Configuration

1. **Get your XION project credentials**:
   - Visit [XION Developer Portal](https://developer.xion.burnt.com)
   - Create a new project
   - Get your Project ID and RPC URL

2. **Update XION configuration**:
   Open `src/services/XionAuthService.tsx` and update the configuration:
   ```typescript
   await xionSDK.initialize({
     projectId: 'your-actual-project-id', // Replace with your project ID
     chainId: 'xion-1',
     rpcUrl: 'https://rpc.xion.burnt.com', // Or your custom RPC URL
   });
   ```

### Environment Setup

1. **Android**:
   - Open `android/app/src/main/AndroidManifest.xml`
   - Add camera and storage permissions:
   ```xml
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
   ```

2. **iOS**:
   - Open `ios/ProofPlay/Info.plist`
   - Add camera and photo library permissions:
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>This app needs camera access to take photos for proof submission</string>
   <key>NSPhotoLibraryUsageDescription</key>
   <string>This app needs photo library access to select images for proof submission</string>
   ```

## Running the App

### Development Server
```bash
npm start
```

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

## Usage

### Authentication Flow

1. **Launch the app** - You'll see the login screen
2. **Choose authentication method**:
   - **Wallet Connect**: Connect your Web3 wallet
   - **Social Login**: Use Google, Apple, or Facebook
3. **Complete authentication** - You'll be redirected to the main app

### Challenge Browsing

1. **View challenges** - The home screen shows available challenges
2. **Challenge details** - Tap any challenge to see full details
3. **Challenge categories**:
   - Fitness (5K runs, workouts)
   - Education (courses, reading)
   - Community (volunteering)
   - Blockchain (smart contracts)
   - Creative (art, design)

### Proof Submission

1. **Select a challenge** - Choose which challenge you completed
2. **Upload proof**:
   - Take a photo with camera
   - Select image from gallery
   - Upload document (PDF, DOC, etc.)
3. **Add description** - Explain how your proof demonstrates completion
4. **Submit for verification** - XION zkTLS will verify your proof
5. **Receive confirmation** - Get proof hash and verification status

## XION Integration Details

### Authentication Service (`XionAuthService.tsx`)

The app includes a comprehensive XION authentication service that handles:

- **SDK Initialization**: Configures XION Mobile Developer Kit
- **Wallet Connection**: Integrates with WalletConnect for Web3 wallets
- **Social Login**: Supports Google, Apple, and Facebook authentication
- **Proof Verification**: Uses XION's zkTLS technology for cryptographic verification

### Key Features

- **Mock Implementation**: Currently uses a mock XION SDK for demonstration
- **Real Integration Ready**: Easy to replace with actual XION SDK
- **Error Handling**: Comprehensive error handling and user feedback
- **Type Safety**: Full TypeScript support with proper interfaces

### Verification Flow

1. **Proof Upload**: User selects file (image/document)
2. **Metadata Preparation**: App prepares proof data with metadata
3. **XION Verification**: Calls XION SDK's `verifyProof()` method
4. **zkTLS Processing**: XION processes proof using zero-knowledge TLS
5. **Result Handling**: App receives verification result and proof hash
6. **User Feedback**: Success/failure message with proof hash

## Development Notes

### Mock XION SDK

The current implementation uses a mock XION SDK for demonstration purposes. To integrate with the real XION Mobile Developer Kit:

1. **Replace mock imports**:
   ```typescript
   // Replace this:
   // import {XionMobileSDK} from '@xionlabs/xion-mobile-sdk';
   
   // With actual XION SDK imports when available
   ```

2. **Update SDK initialization**:
   ```typescript
   // Replace MockXionMobileSDK with actual XION SDK class
   const xionSDK = new XionMobileSDK();
   ```

3. **Configure real endpoints**:
   - Update RPC URLs
   - Add proper project credentials
   - Configure network settings

### Testing

Run tests with:
```bash
npm test
```

### Linting

Check code quality with:
```bash
npm run lint
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npx react-native start --reset-cache
   ```

2. **iOS build issues**:
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android build issues**:
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

### XION SDK Issues

- Ensure you have valid XION project credentials
- Check network connectivity to XION RPC endpoints
- Verify wallet connection permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For XION SDK support:
- [XION Documentation](https://docs.xion.burnt.com)
- [XION Developer Portal](https://developer.xion.burnt.com)
- [XION Discord](https://discord.gg/xion)

For React Native support:
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation Documentation](https://reactnavigation.org/) 