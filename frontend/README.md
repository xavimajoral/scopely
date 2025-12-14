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
- **📡 React Query** - Server state management with intelligent caching and synchronization
- **🧭 React Router** - URL-based navigation for shareable links and browser navigation

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

## 🎣 Custom Hooks

### `useResizableSidebar` Hook

The **`useResizableSidebar`** hook provides a reusable solution for creating resizable sidebars with localStorage persistence. This hook is used in the `TicketNavigation` component to allow users to drag and resize the navigation list.

#### Features

- ✅ **Drag-to-resize** - Users can drag the sidebar edge to adjust width
- ✅ **localStorage persistence** - Sidebar width is saved and restored on page reload
- ✅ **Configurable constraints** - Set minimum width and maximum width percentage
- ✅ **Smooth UX** - Adds CSS classes for cursor and user-select during resize
- ✅ **Type-safe** - Fully typed with TypeScript

#### Usage

```typescript
import { useResizableSidebar } from '@/hooks/useResizableSidebar';

function MyComponent() {
  const { sidebarWidth, sidebarRef, handleMouseDown } = useResizableSidebar({
    localStorageKey: 'mySidebarWidth',  // Optional: custom storage key
    defaultWidth: 400,                   // Optional: default width in pixels
    minWidth: 300,                       // Optional: minimum width
    maxWidthPercent: 0.6,                // Optional: max width as % of viewport
  });

  return (
    <div ref={sidebarRef} style={{ width: sidebarWidth }}>
      {/* Sidebar content */}
      <div onMouseDown={handleMouseDown} className="resize-handle">
        {/* Resize handle */}
      </div>
    </div>
  );
}
```

#### API

| Property | Type | Description |
|----------|------|-------------|
| `sidebarWidth` | `number` | Current width of the sidebar in pixels |
| `isResizing` | `boolean` | Whether the sidebar is currently being resized |
| `sidebarRef` | `RefObject<HTMLDivElement>` | Ref to attach to the sidebar container |
| `handleMouseDown` | `(e: React.MouseEvent) => void` | Handler to attach to the resize handle |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `localStorageKey` | `string` | `'ticketListWidth'` | Key for localStorage persistence |
| `defaultWidth` | `number` | `400` | Default width in pixels |
| `minWidth` | `number` | `300` | Minimum allowed width in pixels |
| `maxWidthPercent` | `number` | `0.6` | Maximum width as percentage of viewport (0.0-1.0) |

#### Implementation Details

- The hook automatically adds a `resizingSidebar` class to `document.body` during resize for global cursor styling
- Width constraints are enforced during drag operations
- localStorage is updated in real-time as the user drags
- The hook cleans up event listeners and CSS classes on unmount

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
| `pnpm test:integration` | Run integration tests only |
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

### Integration Testing

Integration tests verify that components work together with their dependencies (API calls, React Query, etc.) using **MSW (Mock Service Worker)** to mock HTTP requests.

#### Running Integration Tests

Integration tests run with the same commands as unit tests:

```bash
# Run all tests (unit + integration)
pnpm test

# Run only integration tests
pnpm test:integration
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
---

## 🌐 Browser Support

This project uses **Browserslist** to define browser compatibility targets. The configuration ensures consistent browser support across all build tools.

### Current Browser Targets

The project supports:
- ✅ **Modern browsers** (Chrome, Firefox, Safari, Edge)
- ✅ **Last 2 versions** of major browsers
- ✅ **Browsers with >0.2% usage** globally
- ✅ **Firefox ESR** (Extended Support Release)
- ❌ **IE 11** and dead browsers are excluded

## 📡 State Management with React Query

This project uses **@tanstack/react-query** for server state management. React Query provides automatic caching, background refetching, and smart cache invalidation, eliminating the need for manual state management.

**Key Benefits:**
- ✅ **Automatic caching** - Data cached and shared across components
- ✅ **Background synchronization** - Auto-refetch every 30 seconds and on window focus
- ✅ **Smart cache updates** - Automatic invalidation after mutations
- ✅ **Built-in loading/error states** - No manual state management needed

**How it works:**
- **`useQuery`** - Fetches and caches data (e.g., tickets list, ticket details)
- **`useMutation`** - Handles data modifications (create, update, delete)
- **Cache invalidation** - Automatically refetches data after mutations

📖 **For detailed explanation, see [React Query Guide](./REACT_QUERY.md)**

---

## 🎯 Best Practices

- **Use CSS Modules** for component styling
- **Leverage React Compiler** - don't manually memoize
- **Type everything** - TypeScript is our friend
- **Follow component structure** - keep components focused and reusable
- **Use path aliases** - import with `@/` prefix
- **Write tests** - Test components and user interactions
- **Browser compatibility** - Browserslist ensures consistent browser support across tools
- **React Query for server state** - Use `useQuery` for fetching, `useMutation` for updates
