# 📡 State Management with React Query

This project uses **@tanstack/react-query** (formerly React Query) for server state management. React Query handles data fetching, caching, synchronization, and updates automatically, eliminating the need for manual state management with `useState` and `useEffect`.

## 🎯 Why React Query?

Instead of managing server state manually:
```tsx
// ❌ Manual approach (what we DON'T do)
const [tickets, setTickets] = useState([]);
const [loading, setLoading] = useState(false);
useEffect(() => {
  setLoading(true);
  fetch('/api/tickets').then(res => {
    setTickets(res.json());
    setLoading(false);
  });
}, []);
```

We use React Query:
```tsx
// ✅ React Query approach (what we DO)
const { data: tickets, isPending } = useQuery({
  queryKey: ['unresolvedTickets'],
  queryFn: () => apiService.getUnresolvedTickets(),
});
```

**Benefits:**
- ✅ **Automatic caching** - Data is cached and reused across components
- ✅ **Background refetching** - Keeps data fresh automatically
- ✅ **Optimistic updates** - UI updates immediately, syncs in background
- ✅ **Error handling** - Built-in error states and retry logic
- ✅ **Loading states** - Automatic loading indicators
- ✅ **Cache invalidation** - Smart cache updates after mutations

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│         React Components                │
│  (TicketDashboard, TicketDetail, etc.)  │
└──────────────┬──────────────────────────┘
               │ uses
┌──────────────▼────────────────────────┐
│         React Query Hooks             │
│  - useQuery (data fetching)           │
│  - useMutation (data modifications)   │
└──────────────┬────────────────────────┘
               │ manages
┌──────────────▼────────────────────────┐
│      QueryClient (Global Cache)       │
│  - Query Cache (key-value store)      │
│  - Mutation Cache                     │
│  - Background refetching              │
└──────────────┬────────────────────────┘
               │ calls
┌──────────────▼────────────────────────┐
│         API Service Layer             │
│  (apiService.getUnresolvedTickets)    │
└──────────────┬────────────────────────┘
               │
┌──────────────▼────────────────────────┐
│         Backend API                   │
│      (http://localhost:5000/api)      │
└───────────────────────────────────────┘
```

## 📊 Query Keys & Cache Structure

React Query uses **query keys** to identify and cache data:

```typescript
// Query keys in this project:
['unresolvedTickets']                    // List of all unresolved tickets
['ticketDetail', ticketId]               // Specific ticket with ID
```

**Cache Structure:**
```
QueryClient Cache
├── ['unresolvedTickets']
│   ├── data: Ticket[]
│   ├── status: 'success'
│   ├── lastUpdated: timestamp
│   └── staleTime: 30s
│
└── ['ticketDetail', 1]
    ├── data: Ticket
    ├── status: 'success'
    ├── lastUpdated: timestamp
    └── staleTime: 30s
```

## 🔄 Data Fetching (useQuery)

### 1. **Unresolved Tickets Query**

```typescript
// TicketDashboard/index.tsx
const { data: tickets, isPending, error, isFetching } = useQuery({
  queryKey: ['unresolvedTickets'],
  queryFn: async () => {
    return await apiService.getUnresolvedTickets();
  },
  refetchInterval: 30 * 1000,        // Refetch every 30 seconds
  refetchOnWindowFocus: true,         // Refetch when window regains focus
});
```

**What happens:**
1. Component mounts → Query executes → Data fetched from API
2. Data cached with key `['unresolvedTickets']`
3. Every 30 seconds → Background refetch (if component is mounted)
4. Window focus → Refetch to sync with other tabs
5. Other components using same query key → Get cached data instantly

### 2. **Ticket Detail Query**

```typescript
const { data: selectedTicket } = useQuery({
  queryKey: ['ticketDetail', selectedTicketId],
  queryFn: async () => {
    if (!selectedTicketId) return null;
    return await apiService.getTicketById(selectedTicketId);
  },
  enabled: selectedTicketId !== null,  // Only fetch when ticket is selected
  refetchOnWindowFocus: true,
});
```

**What happens:**
1. `selectedTicketId` changes → Query automatically executes
2. If `selectedTicketId` is `null` → Query is disabled (doesn't fetch)
3. Data cached per ticket ID: `['ticketDetail', 1]`, `['ticketDetail', 2]`, etc.
4. Switching between tickets → Uses cache if available, fetches if stale

## ✏️ Data Modifications (useMutation)

Mutations handle create, update, and delete operations:

### 1. **Create Ticket Mutation**

```typescript
// NewTicketModal/index.tsx
const createTicketMutation = useMutation({
  mutationFn: async (dto: CreateTicketDto) => {
    return await apiService.createTicket(dto);
  },
  onSuccess: () => {
    // Invalidate cache to refetch updated data
    queryClient.invalidateQueries({ queryKey: ['unresolvedTickets'] });
    onTicketCreated();
    onClose();
  },
});

// Usage
createTicketMutation.mutate(formData);
```

**Flow:**
1. User submits form → `mutate()` called
2. API request sent → `isPending: true`
3. API responds → `onSuccess` callback
4. Cache invalidated → `['unresolvedTickets']` marked as stale
5. Query automatically refetches → UI updates with new ticket

### 2. **Add Reply Mutation**

```typescript
// ReplyForm/index.tsx
const addAgentReplyMutation = useMutation({
  mutationFn: async (dto: CreateReplyDto) => {
    return await apiService.addReply(ticket.id, dto);
  },
  onSuccess: () => {
    // Invalidate both queries
    queryClient.invalidateQueries({ queryKey: ['ticketDetail', ticket.id] });
    queryClient.invalidateQueries({ queryKey: ['unresolvedTickets'] });
    setReplyMessage('');
    onTicketUpdated();
  },
});
```

**Why invalidate both?**
- `['ticketDetail', ticket.id]` - Ticket now has new reply
- `['unresolvedTickets']` - Ticket status might have changed (Open → InResolution)

### 3. **Resolve Ticket Mutation**

```typescript
// TicketDetail/index.tsx
const resolveTicketMutation = useMutation({
  mutationFn: async () => {
    return await apiService.resolveTicket(ticket.id);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['ticketDetail', ticket?.id] });
    queryClient.invalidateQueries({ queryKey: ['unresolvedTickets'] });
    onTicketResolved?.();  // Clear selection
  },
});
```

## 🔄 Cache Invalidation Strategy

**When to invalidate:**
- ✅ After mutations (create, update, delete)
- ✅ When data might be stale
- ✅ After user actions that change server state

**How it works:**
```typescript
// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['unresolvedTickets'] });

// Invalidate all queries matching pattern
queryClient.invalidateQueries({ queryKey: ['ticketDetail'] });  // All ticket details

// Invalidate and immediately refetch
queryClient.invalidateQueries({ 
  queryKey: ['unresolvedTickets'],
  refetchType: 'active'  // Only refetch if query is currently active
});
```

## ⚙️ Global Configuration

Configured in `main.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,              // Data considered fresh for 30s
      gcTime: 5 * 60 * 1000,             // Cache kept for 5 minutes
      refetchOnWindowFocus: true,         // Refetch on window focus
      refetchOnReconnect: true,           // Refetch on network reconnect
      retry: 3,                           // Retry failed requests 3 times
      retryDelay: (attemptIndex) =>       // Exponential backoff
        Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

**Configuration Explained:**
- **`staleTime: 30s`** - Data is considered fresh for 30 seconds (no refetch needed)
- **`gcTime: 5min`** - Unused cache entries kept for 5 minutes
- **`refetchOnWindowFocus`** - Syncs with changes from other tabs/windows
- **`refetchOnReconnect`** - Syncs after network reconnection
- **`retry: 3`** - Automatically retries failed requests

## 🔄 Synchronization Flow

```
┌─────────────────────────────────────────────────┐
│  User Action: Create Ticket                     │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│  Mutation: createTicketMutation.mutate()        │
│  - API call: POST /api/tickets                  │
│  - isPending: true                              │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│  onSuccess: Cache Invalidation                  │
│  - invalidateQueries(['unresolvedTickets'])     │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│  Automatic Refetch                              │
│  - Query detects cache is stale                 │
│  - Automatically refetches data                 │
│  - UI updates with new ticket                   │
└─────────────────────────────────────────────────┘
```

## 📈 State Management Comparison

| Aspect | Manual useState | React Query |
|--------|----------------|-------------|
| **Caching** | ❌ Manual | ✅ Automatic |
| **Loading States** | ❌ Manual | ✅ Built-in |
| **Error Handling** | ❌ Manual | ✅ Built-in |
| **Refetching** | ❌ Manual | ✅ Automatic |
| **Cache Updates** | ❌ Manual | ✅ Smart invalidation |
| **Background Sync** | ❌ Manual | ✅ Automatic |
| **Optimistic Updates** | ❌ Complex | ✅ Built-in |
| **Code Complexity** | ❌ High | ✅ Low |

## 🎯 Key Patterns in This Project

1. **Query for Reading Data**
   ```typescript
   useQuery({ queryKey: [...], queryFn: ... })
   ```

2. **Mutation for Writing Data**
   ```typescript
   useMutation({ mutationFn: ..., onSuccess: () => invalidateQueries(...) })
   ```

3. **Cache Invalidation After Mutations**
   ```typescript
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: [...] });
   }
   ```

4. **Conditional Queries**
   ```typescript
   enabled: selectedTicketId !== null  // Only fetch when needed
   ```

5. **Automatic Refetching**
   ```typescript
   refetchInterval: 30 * 1000  // Poll every 30 seconds
   refetchOnWindowFocus: true   // Sync on focus
   ```

## 💡 Best Practices Applied

- ✅ **Query keys are descriptive** - `['unresolvedTickets']`, `['ticketDetail', id]`
- ✅ **Mutations invalidate related queries** - Keeps UI in sync
- ✅ **Conditional queries** - Only fetch when needed (`enabled` option)
- ✅ **Error handling** - All mutations have `onError` callbacks
- ✅ **Loading states** - Use `isPending` for better UX
- ✅ **Cache invalidation** - Always invalidate after mutations
- ✅ **Background sync** - Automatic refetching keeps data fresh

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Query Keys Best Practices](https://tkdodo.eu/blog/effective-react-query-keys)

