#!/bin/sh
# docker-entrypoint.sh

set -e

echo "Starting Allowance Tracker..."

# Function to check if postgres is ready using netcat
postgres_ready() {
    nc -z postgres 5432 >/dev/null 2>&1
}

# Wait for database to be ready
echo "Waiting for PostgreSQL to be ready..."
timeout=60
count=0
while ! postgres_ready; do
    echo "PostgreSQL is unavailable - sleeping (attempt $((count + 1))/$timeout)"
    sleep 2
    count=$((count + 1))
    if [ $count -ge $timeout ]; then
        echo "Timeout waiting for PostgreSQL after $timeout attempts"
        exit 1
    fi
done

echo "PostgreSQL is ready!"

# Check if this is a fresh database (no migrations table)
echo "Checking database state..."
if ! npx prisma migrate status >/dev/null 2>&1; then
    echo "Fresh database detected, initializing..."
    # For fresh database, use db push to create schema
    npx prisma db push --force-reset
else
    echo "Existing database found, checking migrations..."
    # Try to deploy migrations
    if ! npx prisma migrate deploy; then
        echo "Migration failed, attempting reset..."
        npx prisma migrate reset --force || {
            echo "Reset failed, forcing schema push..."
            npx prisma db push --force-reset
        }
    fi
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Seed database with initial data
echo "Seeding database..."
npx prisma db seed || echo "Seeding skipped or failed - continuing..."

# Start the application
echo "Starting Next.js application..."
exec node server.js
