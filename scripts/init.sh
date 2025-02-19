#!/bin/bash

# Create Next.js app with TypeScript
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

# Install additional dependencies
npm install \
  @hookform/resolvers \
  axios \
  react-hook-form \
  zod \
  zustand \
  react-hot-toast \
  @headlessui/react \
  clsx \
  tailwind-merge

# Create basic folder structure
mkdir -p src/app/auth
mkdir -p src/components/auth
mkdir -p src/lib/api
mkdir -p src/types
mkdir -p src/store

# Make the script executable
chmod +x scripts/init.sh

echo "Next.js project initialized successfully!"
