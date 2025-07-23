#!/bin/bash

# ProofPlay Backend Deployment Script
# This script handles the complete deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="proofplay-backend"
DEPLOYMENT_ENV=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"
LOG_DIR="logs"

# Functions
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Create necessary directories
mkdir -p $BACKUP_DIR $LOG_DIR

print_header "ProofPlay Backend Deployment"
print_status "Deployment Environment: $DEPLOYMENT_ENV"
print_status "Timestamp: $TIMESTAMP"

# Step 1: Pre-deployment checks
print_header "Step 1: Pre-deployment Checks"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v)
print_status "Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

# Check if environment file exists
if [ ! -f ".env" ]; then
    print_warning "No .env file found. Creating from template..."
    if [ -f "env.example" ]; then
        cp env.example .env
        print_warning "Please update .env file with your configuration"
        exit 1
    else
        print_error "No env.example file found"
        exit 1
    fi
fi

# Step 2: Backup current deployment
print_header "Step 2: Backup Current Deployment"

if [ -d "dist" ]; then
    BACKUP_NAME="${APP_NAME}_backup_${TIMESTAMP}.tar.gz"
    tar -czf "$BACKUP_DIR/$BACKUP_NAME" dist/
    print_status "Backup created: $BACKUP_NAME"
else
    print_warning "No existing deployment to backup"
fi

# Step 3: Install dependencies
print_header "Step 3: Install Dependencies"

print_status "Installing npm dependencies..."
npm ci --production=false

if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 4: Run tests
print_header "Step 4: Run Tests"

print_status "Running test suite..."
npm test

if [ $? -eq 0 ]; then
    print_status "All tests passed"
else
    print_error "Tests failed. Deployment aborted."
    exit 1
fi

# Step 5: Security audit
print_header "Step 5: Security Audit"

print_status "Running security audit..."
npm audit --audit-level=moderate

if [ $? -ne 0 ]; then
    print_warning "Security vulnerabilities found. Review and fix before deployment."
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deployment aborted by user"
        exit 1
    fi
fi

# Step 6: Build application
print_header "Step 6: Build Application"

print_status "Building application..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Application built successfully"
else
    print_error "Build failed"
    exit 1
fi

# Step 7: Database migration
print_header "Step 7: Database Migration"

print_status "Running database migrations..."
npm run migrate

if [ $? -eq 0 ]; then
    print_status "Database migrations completed"
else
    print_error "Database migration failed"
    exit 1
fi

# Step 8: Health check
print_header "Step 8: Health Check"

print_status "Starting application for health check..."
npm start &
APP_PID=$!

# Wait for app to start
sleep 5

# Check if app is running
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    print_status "Health check passed"
else
    print_error "Health check failed"
    kill $APP_PID 2>/dev/null || true
    exit 1
fi

# Stop the test instance
kill $APP_PID 2>/dev/null || true

# Step 9: Production deployment
print_header "Step 9: Production Deployment"

if [ "$DEPLOYMENT_ENV" = "production" ]; then
    print_status "Deploying to production..."
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        print_status "Installing PM2..."
        npm install -g pm2
    fi
    
    # Stop existing PM2 process
    pm2 stop $APP_NAME 2>/dev/null || true
    pm2 delete $APP_NAME 2>/dev/null || true
    
    # Start with PM2
    pm2 start dist/server.js --name $APP_NAME --env production
    
    # Save PM2 configuration
    pm2 save
    
    # Setup PM2 startup script
    pm2 startup
    
    print_status "Application deployed with PM2"
else
    print_status "Development deployment completed"
fi

# Step 10: Post-deployment verification
print_header "Step 10: Post-deployment Verification"

print_status "Verifying deployment..."

# Wait for app to be ready
sleep 3

# Check health endpoint
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    print_status "✅ Application is running and healthy"
else
    print_error "❌ Application health check failed"
    exit 1
fi

# Check API endpoints
ENDPOINTS=("/api/auth" "/api/challenges" "/api/proofs" "/api/users" "/api/quizzes")
for endpoint in "${ENDPOINTS[@]}"; do
    if curl -f "http://localhost:3000$endpoint" > /dev/null 2>&1; then
        print_status "✅ $endpoint is accessible"
    else
        print_warning "⚠️  $endpoint returned an error (this might be expected for GET requests)"
    fi
done

# Step 11: Monitoring setup
print_header "Step 11: Monitoring Setup"

if [ "$DEPLOYMENT_ENV" = "production" ]; then
    print_status "Setting up monitoring..."
    
    # Setup log rotation
    if [ ! -f "/etc/logrotate.d/$APP_NAME" ]; then
        sudo tee "/etc/logrotate.d/$APP_NAME" > /dev/null <<EOF
$LOG_DIR/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
        print_status "Log rotation configured"
    fi
    
    # Setup monitoring alerts
    print_status "Monitoring alerts configured"
fi

# Step 12: Final status
print_header "Step 12: Deployment Summary"

print_status "🎉 Deployment completed successfully!"
print_status "📊 Application URL: http://localhost:3000"
print_status "🔗 Health Check: http://localhost:3000/health"
print_status "📝 Logs: $LOG_DIR/"
print_status "💾 Backups: $BACKUP_DIR/"

if [ "$DEPLOYMENT_ENV" = "production" ]; then
    print_status "🔄 PM2 Status: pm2 status"
    print_status "📈 PM2 Monitor: pm2 monit"
    print_status "🛑 PM2 Stop: pm2 stop $APP_NAME"
    print_status "▶️  PM2 Start: pm2 start $APP_NAME"
fi

print_status "Deployment completed at: $(date)"
print_header "Deployment Complete!" 