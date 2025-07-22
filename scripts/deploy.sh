#!/bin/bash

# ProofPlay Production Deployment Script
# This script handles the deployment process for production

set -e  # Exit on any error

echo "🚀 Starting ProofPlay Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Step 1: Security Audit
print_status "Running security audit..."
npm run security-audit

# Step 2: Run tests
print_status "Running tests..."
npm test

# Step 3: Check for vulnerabilities
print_status "Checking for npm vulnerabilities..."
npm audit --audit-level=moderate

# Step 4: Build the app
print_status "Building the app..."
npx expo build:android --non-interactive
npx expo build:ios --non-interactive

# Step 5: Deploy to Expo
print_status "Deploying to Expo..."
npx expo publish --non-interactive

# Step 6: Update deployment status
print_status "Updating deployment status..."
echo "$(date): Production deployment completed successfully" >> deployment.log

print_status "✅ Production deployment completed successfully!"
print_status "📱 App is now live on Expo"
print_status "🔗 Check the Expo dashboard for build status"

# Optional: Send notification
if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
    print_status "Sending Slack notification..."
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 ProofPlay production deployment completed successfully!\"}" \
        $SLACK_WEBHOOK_URL
fi

echo "🎉 Deployment completed!" 