#!/usr/bin/env node

/**
 * Local Integration Check Script
 * Runs all checks: lint, test, build, and e2e tests
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const frontendDir = join(__dirname, '..');
const backendDir = join(frontendDir, '..', 'backend');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
};

function print(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, cwd = frontendDir) {
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      env: { ...process.env }
    });
    return true;
  } catch (error) {
    return false;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkBackendRunning() {
  try {
    execSync('curl -f http://localhost:5000/api/tickets', { 
      stdio: 'ignore',
      timeout: 2000 
    });
    return true;
  } catch {
    return false;
  }
}

async function startBackend() {
  print('Starting backend...', 'yellow');
  const backendApiDir = join(backendDir, 'SupportTicketingSystem.Api');
  
  if (!existsSync(backendApiDir)) {
    print('❌ Backend directory not found', 'red');
    return null;
  }

  try {
    // Check if .NET is available
    execSync('dotnet --version', { stdio: 'ignore' });
  } catch {
    print('❌ .NET SDK is not installed', 'red');
    return null;
  }

  print('⚠️  Backend needs to be started manually for E2E tests', 'yellow');
  print('Please run in another terminal:', 'yellow');
  print(`  cd ${backendApiDir}`, 'yellow');
  print('  dotnet run', 'yellow');
  print('\nWaiting for backend to be ready...', 'yellow');
  
  // Wait for backend to be ready (up to 60 seconds)
  for (let i = 0; i < 30; i++) {
    if (checkBackendRunning()) {
      print('✅ Backend is ready!', 'green');
      return true;
    }
    if (i === 29) {
      print('❌ Backend failed to start within 60 seconds', 'red');
      print('Please start the backend manually and run: pnpm test:e2e', 'yellow');
      return false;
    }
    await sleep(2000);
  }
  
  return false;
}

async function main() {
  print('🚀 Starting Integration Check...', 'yellow');
  print('================================\n', 'yellow');

  // Step 1: Lint
  print('ℹ️  Step 1/4: Running ESLint...', 'yellow');
  if (!runCommand('pnpm lint')) {
    print('❌ Lint failed!', 'red');
    process.exit(1);
  }
  print('✅ Lint passed!\n', 'green');

  // Step 2: Tests
  print('ℹ️  Step 2/4: Running tests (unit + integration)...', 'yellow');
  if (!runCommand('pnpm test')) {
    print('❌ Tests failed!', 'red');
    process.exit(1);
  }
  print('✅ Tests passed!\n', 'green');

  // Step 3: Build
  print('ℹ️  Step 3/4: Building frontend...', 'yellow');
  if (!runCommand('pnpm build')) {
    print('❌ Build failed!', 'red');
    process.exit(1);
  }
  print('✅ Build successful!\n', 'green');

  // Step 4: E2E Tests
  print('ℹ️  Step 4/4: Running E2E tests...', 'yellow');
  print('This requires the backend to be running on http://localhost:5000', 'yellow');

  const backendRunning = checkBackendRunning();

  if (!backendRunning) {
    const started = await startBackend();
    if (!started) {
      print('❌ Cannot proceed without backend', 'red');
      process.exit(1);
    }
  } else {
    print('✅ Backend is already running. Proceeding with E2E tests...', 'green');
  }

  // Run E2E tests
  const e2eSuccess = runCommand('pnpm test:e2e');

  if (!e2eSuccess) {
    print('❌ E2E tests failed!', 'red');
    process.exit(1);
  }
  print('✅ E2E tests passed!\n', 'green');

  print('================================', 'yellow');
  print('✅ All checks passed! 🎉', 'green');
  print('================================', 'yellow');
}

main().catch((error) => {
  print(`❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});

