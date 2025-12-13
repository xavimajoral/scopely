# 🚀 Frontend Development

> **Built with modern web technologies for blazing-fast development and production builds**

Welcome to the frontend of our Support Ticketing System! This is a cutting-edge React application powered by TypeScript and Vite, designed for speed, type safety, and developer experience.

---

## ⚡ Tech Stack

### Core Technologies
- **⚛️ React 19** - The latest React with cutting-edge features
- **📘 TypeScript** - Type-safe development for fewer bugs
- **⚡ Vite 7** - Lightning-fast build tool and dev server
- **🎨 CSS Modules** - Scoped styling for maintainable components

### Key Features
- **🔄 React Compiler** - Automatic optimization and memoization
- **🛠️ Hot Module Replacement (HMR)** - Instant updates during development
- **📦 Tree-shaking** - Optimized bundle sizes
- **🎯 Path Aliases** - Clean imports with `@/` prefix

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

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |

---

## 🎯 Best Practices

- **Use CSS Modules** for component styling
- **Leverage React Compiler** - don't manually memoize
- **Type everything** - TypeScript is our friend
- **Follow component structure** - keep components focused and reusable
- **Use path aliases** - import with `@/` prefix
