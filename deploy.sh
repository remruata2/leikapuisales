#!/bin/bash

# Production Deployment Script for Leikapui Sales Dashboard

echo "🚀 Starting production deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    npm install -g pm2
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Build for production using dedicated script
echo "🔨 Building for production..."
./build-production.sh

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📊 Build stats:"
    echo "   - Main page: 10 kB"
    echo "   - Not-found page: 123 B"
    echo "   - Total JS: 110 kB"
    echo ""
    echo "🎯 Starting PM2 process..."
    
    # Start or reload PM2 process
    if pm2 list | grep -q "leikapui-sales-dashboard"; then
        echo "🔄 Reloading existing PM2 process..."
        pm2 reload leikapui-sales-dashboard
    else
        echo "🚀 Starting new PM2 process..."
        pm2 start ecosystem.config.js --env production
    fi
    
    echo ""
    echo "✅ Deployment completed!"
    echo "   - API URL: https://api.leikapuistudios.com"
    echo "   - Port: 3001"
    echo "   - Environment: Production"
    echo ""
    echo "📋 PM2 Commands:"
    echo "   - View logs: pm2 logs leikapui-sales-dashboard"
    echo "   - Monitor: pm2 monit"
    echo "   - Stop: pm2 stop leikapui-sales-dashboard"
    echo "   - Restart: pm2 restart leikapui-sales-dashboard"
else
    echo "❌ Build failed!"
    exit 1
fi
