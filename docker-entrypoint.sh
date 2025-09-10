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

# Reset database migrations if they failed
echo "Checking migration status..."
if ! npx prisma migrate status; then
    echo "Migrations are in a bad state, resetting..."
    npx prisma migrate reset --force || {
        echo "Reset failed, trying to resolve manually..."
        npx prisma db push --force-reset
    }
fi

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy || {
    echo "Migration deploy failed, trying db push..."
    npx prisma db push
}

# Generate Prisma client (in case it's not already generated)
echo "Generating Prisma client..."
npx prisma generate || {
    echo "Client generation failed, trying without cache..."
    rm -rf node_modules/.prisma/client 2>/dev/null || true
    npx prisma generate
}

# Seed database with initial data (optional)
echo "Seeding database..."
npx prisma db seed || echo "Seeding skipped or failed - continuing..."

# Start the application
echo "Starting Next.js application..."
exec node server.js
