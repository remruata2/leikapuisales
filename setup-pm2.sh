#!/bin/bash

# PM2 Setup Script for Leikapui Sales Dashboard
# Run this script on your production server for initial setup

echo "🚀 Setting up PM2 for Leikapui Sales Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install PM2 globally
echo "📦 Installing PM2 globally..."
npm install -g pm2

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Build the project using dedicated script
echo "🔨 Building the project..."
./build-production.sh

# Start PM2 process
echo "🚀 Starting PM2 process..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Setup PM2 to start on boot
echo "🔧 Setting up PM2 to start on boot..."
pm2 startup

echo ""
echo "✅ PM2 setup completed!"
echo ""
echo "📋 Useful commands:"
echo "   - View logs: pm2 logs leikapui-sales-dashboard"
echo "   - Monitor: pm2 monit"
echo "   - Status: pm2 status"
echo "   - Restart: pm2 restart leikapui-sales-dashboard"
echo "   - Stop: pm2 stop leikapui-sales-dashboard"
echo ""
echo "🌐 Dashboard should be available at: http://your-server-ip:3001" 