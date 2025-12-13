# 🚀 Frontend Development

> **Built with modern web technologies for blazing-fast development and production builds**

Welcome to the frontend of our Support Ticketing System! This is a cutting-edge React application powered by TypeScript and Vite, designed for speed, type safety, and developer experience.

---

## ⚡ Tech Stack

### Core Technologies
- **⚛️ React 19.2.3** - The latest React with cutting-edge features and security patches
- **📘 TypeScript** - Type-safe development for fewer bugs
- **⚡ Vite 7** - Lightning-fast build tool and dev server
- **🎨 CSS Modules** - Scoped styling for maintainable components

> 🔒 **Security Update**: React and React-DOM have been upgraded to version 19.2.3 to address security vulnerabilities discovered last week.

### Key Features
- **🔄 React Compiler** - Automatic optimization and memoization
- **🛠️ Hot Module Replacement (HMR)** - Instant updates during development
- **📦 Tree-shaking** - Optimized bundle sizes
- **🎯 Path Aliases** - Clean imports with `@/` prefix
- **📏 Resizable Navigation** - Drag the navigation list's right edge to adjust width (persisted in localStorage)
- **🔄 Backend Synchronization** - Automatic sync with backend every 30 seconds and on window focus

---

## 🎯 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **pnpm** package manager ([Install pnpm](https://pnpm.io/installation))

### Installation & Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The development server will start at `http://localhost:5173` (or the next available port).

---

## 🧠 React Compiler

This project uses the **React Compiler** for automatic optimization. This means:

✨ **No manual memoization needed** - The compiler handles `useMemo`, `useCallback`, and `React.memo` automatically  
⚡ **Better performance** - Automatic optimization of re-renders  
🎯 **Cleaner code** - Focus on logic, not optimization

> **Note:** The React Compiler may impact Vite dev & build performance, but the runtime benefits are worth it!

Learn more: [React Compiler Documentation](https://react.dev/learn/react-compiler)

---

## 🎨 Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── types.ts        # TypeScript type definitions
│   └── main.tsx        # Application entry point
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

---

## 🔧 Development Tools

### Code Quality
- **ESLint** - Linting for code quality
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |
| `pnpm test` | Run unit tests in watch mode |
| `pnpm test:ui` | Run unit tests with UI |
| `pnpm test:run` | Run unit tests once |
| `pnpm test:coverage` | Run unit tests with coverage report |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm test:e2e:ui` | Run E2E tests with UI |
| `pnpm test:e2e:headed` | Run E2E tests in headed mode |
| `pnpm test:e2e:debug` | Run E2E tests in debug mode |
| `pnpm test:e2e:report` | Show E2E test report |

---

## 🧪 Testing

This project uses **Vitest** and **React Testing Library** for unit testing, **MSW (Mock Service Worker)** for integration testing, and **Playwright** for end-to-end testing.

### Unit Testing

#### Running Unit Tests

```bash
# Run tests in watch mode (default)
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage
```

#### Writing Unit Tests

Tests are located next to the components they test with the `.test.tsx` extension:

```
components/
  ├── TicketList/
  │   ├── index.tsx
  │   ├── TicketList.module.css
  │   └── TicketList.test.tsx  # Test file
```

#### Unit Test Setup

- Test environment: `jsdom` (browser-like environment)
- Setup file: `src/test/setup.ts`
- CSS Modules are supported in tests
- Path aliases (`@/`) work in tests

### Integration Testing

Integration tests verify that components work together with their dependencies (API calls, React Query, etc.) using **MSW (Mock Service Worker)** to mock HTTP requests.

#### Running Integration Tests

Integration tests run with the same commands as unit tests:

```bash
# Run all tests (unit + integration)
pnpm test

# Run only integration tests
pnpm test:integration"
```

#### Writing Integration Tests

Integration tests are located next to components with the `.integration.test.tsx` extension:

```
components/
  ├── TicketDashboard/
  │   ├── index.tsx
  │   └── TicketDashboard.integration.test.tsx  # Integration test
```

#### Integration Test Features

- **MSW (Mock Service Worker)** - Intercepts and mocks API requests
- **React Query Integration** - Tests components with real QueryClient
- **User Interactions** - Tests complete user flows (create, update, delete)
- **Error Handling** - Tests error states and error recovery
- **API Mocking** - Mock handlers in `src/test/mocks/handlers.ts`

#### Example Integration Test

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import TicketDashboard from './index';

it('should create a new ticket', async () => {
  const user = userEvent.setup();
  
  // Override mock for this test
  server.use(
    http.post('/api/tickets', async ({ request }) => {
      const body = await request.json();
      return HttpResponse.json({ id: 1, ...body }, { status: 201 });
    })
  );

  render(<TicketDashboard />, { wrapper: createTestWrapper() });
  
  await user.click(screen.getByRole('button', { name: /new ticket/i }));
  await user.type(screen.getByLabelText(/subject/i), 'Test Ticket');
  await user.click(screen.getByRole('button', { name: /create ticket/i }));
  
  await waitFor(() => {
    expect(screen.getByText('Test Ticket')).toBeInTheDocument();
  });
});
```

### End-to-End Testing (Playwright)

#### Running E2E Tests

```bash
# Run E2E tests (headless)
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run E2E tests in headed mode (see browser)
pnpm test:e2e:headed

# Run E2E tests in debug mode
pnpm test:e2e:debug

# Show test report
pnpm test:e2e:report
```

#### E2E Test Structure

E2E tests are located in the `e2e/` directory:

```
e2e/
  ├── ticket-dashboard.spec.ts      # Dashboard tests
  ├── ticket-creation.spec.ts        # Ticket creation tests
  ├── ticket-interaction.spec.ts     # Ticket interaction tests
  └── ticket-resolution.spec.ts      # Ticket resolution tests
```

#### E2E Test Setup

- **Automatically starts dev server** before running tests
- **Base URL**: `http://localhost:5173`
- **Browsers**: Chromium, Firefox, WebKit
- **Screenshots**: Captured on test failures
- **Traces**: Collected on retries for debugging

#### Prerequisites for E2E Tests

1. **Backend must be running** on `http://localhost:5000` (or set `VITE_API_URL` environment variable)
2. **Install Playwright browsers** (first time only):
   ```bash
   pnpm exec playwright install
   ```

#### Writing E2E Tests

Example E2E test:

```typescript
import { test, expect } from '@playwright/test';

test('should create a new ticket', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /new ticket/i }).click();
  await page.getByLabel(/subject/i).fill('Test Ticket');
  await page.getByRole('button', { name: /create ticket/i }).click();
  await expect(page.getByText('Test Ticket')).toBeVisible();
});
```

---

## 🎯 Best Practices

- **Use CSS Modules** for component styling
- **Leverage React Compiler** - don't manually memoize
- **Type everything** - TypeScript is our friend
- **Follow component structure** - keep components focused and reusable
- **Use path aliases** - import with `@/` prefix
- **Write tests** - Test components and user interactions
