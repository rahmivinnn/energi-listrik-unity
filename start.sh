#!/bin/bash

# Energy Quest - Full Stack Application Startup Script

echo "🚀 Starting Energy Quest Full Stack Application..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p frontend/build

# Set permissions
echo "🔐 Setting permissions..."
chmod +x backend/healthcheck.js

# Start services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."

# Check MongoDB
if docker-compose exec -T mongodb mongosh --eval "db.runCommand('ping')" &> /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB failed to start"
fi

# Check Backend
if curl -f http://localhost:5000/health &> /dev/null; then
    echo "✅ Backend API is running"
else
    echo "❌ Backend API failed to start"
fi

# Check Frontend
if curl -f http://localhost:3000 &> /dev/null; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend failed to start"
fi

echo ""
echo "🎉 Energy Quest is now running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "📊 MongoDB: localhost:27017"
echo ""
echo "📚 API Documentation: http://localhost:5000/health"
echo ""
echo "🛑 To stop the application, run: docker-compose down"
echo ""

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20