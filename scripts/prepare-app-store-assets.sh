#!/bin/bash

# ProofPlay App Store Assets Preparation Script
# This script prepares all necessary assets for app store submission

set -e

echo "📱 Preparing ProofPlay App Store Assets..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create assets directory
mkdir -p app-store-assets

# App Store Connect metadata
cat > app-store-assets/metadata.txt << EOF
ProofPlay - Challenge Completion & Proof Verification App

Description:
ProofPlay is a revolutionary React Native app that integrates XION's Mobile Developer Kit for user authentication and proof verification using zkTLS technology. Complete challenges, submit proofs, and earn rewards in a secure, blockchain-powered environment.

Key Features:
• XION Authentication: Secure wallet connect and social login
• Challenge Feed: Browse and complete various challenges
• Proof Submission: Upload images or documents as proof
• zkTLS Verification: Cryptographic proof verification
• Modern UI: Clean, responsive design

Keywords:
blockchain,challenges,proof,verification,xion,zkTLS,authentication,rewards

Category: Productivity
Subcategory: Utilities

Age Rating: 4+
Content Rating: Everyone

Support URL: https://github.com/mooncakeSG/ProofPlay
Marketing URL: https://proofplay.app
Privacy Policy URL: https://proofplay.app/privacy
EOF

# App Store screenshots requirements
print_status "Creating screenshot requirements guide..."

cat > app-store-assets/screenshot-requirements.md << EOF
# App Store Screenshot Requirements

## iOS App Store
- iPhone 6.7" Display: 1290 x 2796 pixels
- iPhone 6.5" Display: 1242 x 2688 pixels
- iPhone 5.5" Display: 1242 x 2208 pixels
- iPad Pro 12.9" Display: 2048 x 2732 pixels
- iPad Pro 11" Display: 1668 x 2388 pixels

## Google Play Store
- Phone: 1080 x 1920 pixels (16:9 ratio)
- 7-inch tablet: 1200 x 1920 pixels (5:4 ratio)
- 10-inch tablet: 1920 x 1200 pixels (8:5 ratio)

## Required Screenshots
1. Login Screen - Show authentication options
2. Challenge Feed - Display available challenges
3. Challenge Detail - Show challenge information
4. Proof Submission - Demonstrate proof upload
5. Success Screen - Show verification completion

## Screenshot Guidelines
- Use high-quality images
- Show real app functionality
- Include descriptive text overlays
- Maintain consistent branding
- Test on actual devices
EOF

# App icon requirements
print_status "Creating icon requirements guide..."

cat > app-store-assets/icon-requirements.md << EOF
# App Icon Requirements

## iOS App Store
- 1024 x 1024 pixels (required)
- PNG format
- No transparency
- No rounded corners (Apple adds them automatically)
- No alpha channel

## Google Play Store
- 512 x 512 pixels (required)
- PNG format
- No transparency
- Square format (no rounded corners)

## Design Guidelines
- Simple, recognizable design
- Good contrast
- No text (except for the app name)
- Scalable to small sizes
- Consistent with app branding

## Icon Sizes Needed
- iOS: 1024x1024
- Android: 512x512
- Various sizes for different devices
EOF

# Create placeholder directories for assets
mkdir -p app-store-assets/screenshots/ios
mkdir -p app-store-assets/screenshots/android
mkdir -p app-store-assets/icons

print_status "Created app store assets structure:"
echo "  📁 app-store-assets/"
echo "    📄 metadata.txt"
echo "    📄 screenshot-requirements.md"
echo "    📄 icon-requirements.md"
echo "    📁 screenshots/"
echo "      📁 ios/"
echo "      📁 android/"
echo "    📁 icons/"

print_warning "Next steps:"
echo "  1. Add app icons to app-store-assets/icons/"
echo "  2. Add screenshots to app-store-assets/screenshots/"
echo "  3. Update metadata.txt with final app information"
echo "  4. Test app on real devices for screenshots"

print_status "✅ App store assets preparation completed!" 