#!/bin/bash

# Local Integration Check Script
# Runs all checks: lint, test, build, and e2e tests

set -e  # Exit on any error

echo "🚀 Starting Integration Check..."
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install pnpm first."
    exit 1
fi

# Check if backend directory exists
if [ ! -d "../backend" ]; then
    print_error "Backend directory not found. Please run this script from the frontend directory."
    exit 1
fi

# Step 1: Lint
echo ""
print_info "Step 1/4: Running ESLint..."
if pnpm lint; then
    print_success "Lint passed!"
else
    print_error "Lint failed!"
    exit 1
fi

# Step 2: Tests (unit + integration)
echo ""
print_info "Step 2/4: Running tests (unit + integration)..."
if pnpm test; then
    print_success "Tests passed!"
else
    print_error "Tests failed!"
    exit 1
fi

# Step 3: Build
echo ""
print_info "Step 3/4: Building frontend..."
if pnpm build; then
    print_success "Build successful!"
else
    print_error "Build failed!"
    exit 1
fi

# Step 4: E2E Tests (requires backend)
echo ""
print_info "Step 4/4: Running E2E tests..."
print_info "This requires the backend to be running on http://localhost:5000"

# Check if backend is running
if curl -f http://localhost:5000/api/tickets > /dev/null 2>&1; then
    print_info "Backend is already running. Proceeding with E2E tests..."
    if pnpm test:e2e; then
        print_success "E2E tests passed!"
    else
        print_error "E2E tests failed!"
        exit 1
    fi
else
    print_info "Backend is not running. Starting backend for E2E tests..."
    
    # Check if .NET is installed
    if ! command -v dotnet &> /dev/null; then
        print_error ".NET SDK is not installed. Cannot start backend."
        print_info "Please start the backend manually and run: pnpm test:e2e"
        exit 1
    fi
    
    # Start backend in background
    print_info "Starting backend..."
    cd ../backend/SupportTicketingSystem.Api
    dotnet run > ../../frontend/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ../../frontend
    
    # Wait for backend to be ready
    print_info "Waiting for backend to be ready..."
    for i in {1..30}; do
        if curl -f http://localhost:5000/api/tickets > /dev/null 2>&1; then
            print_success "Backend is ready!"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Backend failed to start within 60 seconds"
            kill $BACKEND_PID 2>/dev/null || true
            exit 1
        fi
        sleep 2
    done
    
    # Run E2E tests
    if pnpm test:e2e; then
        print_success "E2E tests passed!"
    else
        print_error "E2E tests failed!"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    # Stop backend
    print_info "Stopping backend..."
    kill $BACKEND_PID 2>/dev/null || true
    pkill -f "dotnet.*SupportTicketingSystem.Api" 2>/dev/null || true
fi

echo ""
echo "================================"
print_success "All checks passed! 🎉"
echo "================================"

