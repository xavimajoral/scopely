import '@testing-library/jest-dom';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Dynamically import MSW server to avoid SSR transformation issues
let server: ReturnType<typeof import('msw/node').setupServer> | null = null;

beforeAll(async () => {
  const { setupServer } = await import('msw/node');
  const { handlers } = await import('./mocks/handlers');
  server = setupServer(...handlers);
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers after each test
afterEach(() => {
  cleanup();
  if (server) {
    server.resetHandlers();
  }
});

// Clean up after all tests
afterAll(() => {
  if (server) {
    server.close();
  }
});

// Export server for use in integration tests
export { server };

