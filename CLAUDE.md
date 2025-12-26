# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack customer support ticketing system with a .NET 8 backend and React 19 frontend in a monorepo structure.

## Common Commands

### Backend (.NET 8)
```bash
cd backend
dotnet restore          # Download NuGet packages
dotnet build           # Compile solution
dotnet test            # Run xUnit tests
cd SupportTicketingSystem.Api && dotnet run  # Start API on http://localhost:5000
```

### Frontend (React + TypeScript + Vite)
```bash
cd frontend
pnpm install           # Install dependencies
pnpm dev              # Start dev server on http://localhost:5173
pnpm build            # Production build
pnpm lint             # ESLint
pnpm format           # Prettier formatting
pnpm test             # Unit + integration tests (Vitest)
pnpm test:run         # Run tests once (non-watch mode)
pnpm test:integration # Integration tests only
pnpm test:e2e         # Playwright E2E tests (requires backend running)
pnpm test:e2e:headed  # E2E tests with visible browser
pnpm integration      # Full integration check (lint, test, build, e2e)
```

### Running a Single Test
```bash
# Backend - run specific test class/method
dotnet test --filter "FullyQualifiedName~TicketServiceTests"

# Frontend - run specific test file
pnpm test TicketList.test.tsx
pnpm test:e2e e2e/ticket-dashboard.spec.ts
```

## Architecture

### Backend: Clean Architecture (.NET 8)

```
backend/
├── SupportTicketingSystem.Domain/    # Core entities (Ticket, Reply, TicketStatus) - no dependencies
├── SupportTicketingSystem.Data/      # EF Core + SQLite, Repository implementations
├── SupportTicketingSystem.Services/  # Business logic (TicketService), status transitions
├── SupportTicketingSystem.Api/       # REST controllers, DTOs, Swagger at /swagger
└── SupportTicketingSystem.Tests/     # xUnit tests
```

**Key patterns:**
- Repository pattern (ITicketRepository, IReplyRepository)
- Service layer pattern (TicketService orchestrates business logic)
- Dependency injection configured in Program.cs
- DTOs separate API contracts from domain entities

**Database:** SQLite, auto-created at `backend/SupportTicketingSystem.Api/support_tickets.db`. Delete to reset.

### Frontend: React 19 + TypeScript

```
frontend/src/
├── components/     # React components (TicketDashboard, TicketList, TicketDetail, etc.)
├── hooks/          # Custom hooks (useResizableSidebar)
├── services/       # API service layer (apiService)
├── test/           # Test setup and MSW mocks
└── types.ts        # TypeScript definitions
```

**Key patterns:**
- React Query for server state (useQuery for fetching, useMutation for updates)
- Query keys: `['unresolvedTickets']`, `['ticketDetail', ticketId]`
- Cache invalidation after mutations to keep UI in sync
- React Router for URL-based navigation (`/`, `/tickets/:ticketId`)
- CSS Modules for scoped styling
- React Compiler handles memoization automatically (no manual useMemo/useCallback needed)

**State sync:** Auto-refetch every 30s + on window focus. After mutations, invalidate related queries.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tickets | Get all unresolved tickets |
| GET | /api/tickets/{id} | Get ticket by ID with replies |
| POST | /api/tickets | Create new ticket |
| POST | /api/tickets/{id}/replies | Add reply to ticket |
| POST | /api/tickets/{id}/resolve | Mark ticket as resolved |

## Testing Strategy

- **Backend:** xUnit for unit tests on service layer
- **Frontend Unit/Integration:** Vitest + React Testing Library + MSW for API mocking
- **Frontend E2E:** Playwright (tests in `frontend/e2e/`)

Test files are co-located with components: `ComponentName.test.tsx`

## Git Workflow

A pre-push hook runs `pnpm integration` (lint, tests, build, e2e). Skip with `git push --no-verify`.

## Key Conventions

- Frontend uses `@/` path alias for imports
- Prettier: 100 char line width, single quotes, semicolons
- Backend uses System.Text.Json with custom enum naming
- CORS configured for localhost ports 3000, 3001, 5173, 4200
