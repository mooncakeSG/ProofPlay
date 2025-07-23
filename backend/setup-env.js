#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up ProofPlay Backend Environment...\n');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping setup.');
  console.log('📝 If you want to update it, delete the existing .env file and run this script again.\n');
  process.exit(0);
}

// Read the example file
const examplePath = path.join(__dirname, 'env.example');
if (!fs.existsSync(examplePath)) {
  console.error('❌ env.example file not found!');
  process.exit(1);
}

try {
  const exampleContent = fs.readFileSync(examplePath, 'utf8');
  
  // Create .env file with the example content
  fs.writeFileSync(envPath, exampleContent);
  
  console.log('✅ .env file created successfully!');
  console.log('📝 Please update the following required values in your .env file:\n');
  
  console.log('🔑 REQUIRED FOR BASIC FUNCTIONALITY:');
  console.log('   - JWT_SECRET (generate a strong random string)');
  console.log('   - JWT_REFRESH_SECRET (generate a strong random string)');
  console.log('   - SESSION_SECRET (generate a strong random string)');
  console.log('   - COOKIE_SECRET (generate a strong random string)\n');
  
  console.log('🌐 REQUIRED FOR SOCIAL LOGIN:');
  console.log('   - GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET');
  console.log('   - APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY');
  console.log('   - FACEBOOK_APP_ID & FACEBOOK_APP_SECRET\n');
  
  console.log('🔗 REQUIRED FOR WALLET CONNECT:');
  console.log('   - WALLET_CONNECT_PROJECT_ID\n');
  
  console.log('📧 REQUIRED FOR EMAIL FUNCTIONALITY:');
  console.log('   - EMAIL_USER & EMAIL_PASSWORD (Gmail app password)\n');
  
  console.log('☁️  REQUIRED FOR FILE UPLOADS (AWS S3):');
  console.log('   - AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY');
  console.log('   - AWS_REGION & AWS_S3_BUCKET\n');
  
  console.log('🔗 REQUIRED FOR XION INTEGRATION:');
  console.log('   - XION_CONTRACT_ADDRESS');
  console.log('   - XION_REWARD_CONTRACT\n');
  
  console.log('📊 OPTIONAL FOR MONITORING:');
  console.log('   - SENTRY_DSN');
  console.log('   - NEW_RELIC_LICENSE_KEY\n');
  
  console.log('💡 TIP: For development, you can leave most optional values as "your-*" placeholders.');
  console.log('   The app will work with mock data and basic functionality.\n');
  
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
} 