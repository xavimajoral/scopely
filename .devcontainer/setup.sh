#!/bin/bash

set -e

echo "🚀 Setting up Support Ticketing System development environment..."

# Install pnpm globally
echo "📦 Installing pnpm..."
npm install -g pnpm@latest

# Setup backend
echo "🔧 Setting up backend..."
cd backend
dotnet restore
dotnet build

# Setup frontend
echo "🎨 Setting up frontend..."
cd ../frontend
pnpm install

echo ""
echo "✅ Development environment ready!"
echo ""
echo "📝 Next steps:"
echo "   1. Backend: cd backend/SupportTicketingSystem.Api && dotnet run"
echo "   2. Frontend: cd frontend && pnpm dev"
echo ""
echo "🌐 URLs:"
echo "   - Backend API: http://localhost:5000"
echo "   - Frontend: http://localhost:5173"
echo "   - Swagger: http://localhost:5000/swagger"
echo ""

