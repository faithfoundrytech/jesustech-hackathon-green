#!/bin/bash

# Clean Next.js cache
echo "Cleaning Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache

# Rebuild the project
echo "Rebuilding project..."
npm run build

echo "Build completed!" 