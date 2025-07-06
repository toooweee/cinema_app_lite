#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "Database is ready!"

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Seed the database
echo "Seeding the database..."
npx prisma db seed

# Start the application
echo "Starting the application..."
exec npm run start:prod 