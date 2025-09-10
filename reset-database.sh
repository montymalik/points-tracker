#!/bin/bash
# reset-database.sh - Clean reset of database and migrations

echo "🗑️ Resetting database and fixing migration issues..."

# Stop all containers
echo "🛑 Stopping all containers..."
docker compose down

# Remove database volume to start fresh
echo "🧹 Removing database volume..."
docker volume rm allowance-tracker_postgres_data 2>/dev/null || true

# Remove web container to rebuild
echo "🔨 Removing web container for rebuild..."
docker rm -f allowance-tracker-web 2>/dev/null || true

# Rebuild the web container with fixes
echo "🔧 Rebuilding web container..."
docker compose build web --no-cache

# Start services
echo "🚀 Starting services with fresh database..."
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Check status
echo "📊 Checking service status..."
docker compose ps

echo ""
echo "📋 Monitoring startup logs (Ctrl+C to exit)..."
echo "Watch for 'Starting Next.js application...' message"
echo ""
docker compose logs -f web
