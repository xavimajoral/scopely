import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import TicketDashboard from './components/TicketDashboard';
import '@/assets/globals.css';

// Configure QueryClient with synchronization strategies
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Refetch on window focus to sync with database changes from other tabs/windows
      refetchOnWindowFocus: true,
      // Refetch on reconnect to sync after network reconnection
      refetchOnReconnect: true,
      // Consider data stale after 30 seconds (will refetch when component mounts)
      staleTime: 30 * 1000,
      // Keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <TicketDashboard />,
  },
  {
    path: '/tickets/:ticketId',
    element: <TicketDashboard />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
