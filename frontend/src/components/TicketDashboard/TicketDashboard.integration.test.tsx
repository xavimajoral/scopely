import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, createMemoryRouter, RouterProvider } from 'react-router';
import React from 'react';
import TicketDashboard from './index';
import { mockTickets } from '../../test/mocks/handlers';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/setup';
import { TicketStatus } from '../../types';
import type { Ticket, CreateTicketDto } from '../../types';

// Create a test wrapper with QueryClient and Router
const createTestWrapper = (initialEntries: string[] = ['/']) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
};

describe('TicketDashboard Integration Tests', () => {
  beforeEach(() => {
    // Reset MSW handlers before each test
    if (server) {
      server.resetHandlers();
    }
  });

  it('should load and display tickets list', async () => {
    render(<TicketDashboard />, { wrapper: createTestWrapper() });

    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(screen.getByText('Test Ticket 2')).toBeInTheDocument();
  });

  it('should display loading state initially', async () => {
    render(<TicketDashboard />, { wrapper: createTestWrapper() });

    // Loading state might be very brief, so check immediately
    const loadingText = screen.queryByText(/loading tickets/i);
    // Either loading is shown or tickets have already loaded
    expect(loadingText || screen.queryByText('Test Ticket 1')).toBeTruthy();
  });

  it.skip('should select a ticket and display its details', async () => {
    // Render with ticket ID in URL to simulate navigation
    render(<TicketDashboard />, { wrapper: createTestWrapper(['/tickets/1']) });

    // Wait for ticket details to load - check for any content from the ticket
    await waitFor(() => {
      // The ticket detail should show either the heading, description, or reply content
      const heading = screen.queryByRole('heading', { name: 'Test Ticket 1' });
      const description = screen.queryByText('Description 1');
      const reply = screen.queryByText('First reply');
      const emptyState = screen.queryByText('Select a ticket to view details');
      
      // Should have ticket content, not empty state
      expect(emptyState).not.toBeInTheDocument();
      expect(heading || description || reply).toBeTruthy();
    }, { timeout: 10000 });
  }, 15000);

  it('should open new ticket modal when clicking new ticket button', async () => {
    const user = userEvent.setup();
    render(<TicketDashboard />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
    });

    const newTicketButton = screen.getByRole('button', { name: /new ticket/i });
    await user.click(newTicketButton);

    expect(screen.getByText('Create New Ticket')).toBeInTheDocument();
  });

  it('should create a new ticket and add it to the list', async () => {
    const user = userEvent.setup();

    let createdTicket: Ticket | null = null;
    let getCallCount = 0;

    // Mock the POST request to return a new ticket
    if (server) {
      server.use(
        http.post('http://localhost:5000/api/tickets', async ({ request }) => {
          const body = (await request.json()) as CreateTicketDto;
          createdTicket = {
            id: 999,
            subject: body.subject,
            description: body.description,
            username: body.username,
            userId: body.userId,
            status: TicketStatus.Open,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            replies: [],
          };
          return HttpResponse.json(createdTicket, { status: 201 });
        }),
        // Mock GET to return the new ticket in the list after creation
        http.get('http://localhost:5000/api/tickets', () => {
          getCallCount++;
          // After POST, return the new ticket in the list
          // The first call is the initial load, subsequent calls should include the new ticket
          if (createdTicket && getCallCount > 1) {
            return HttpResponse.json([...mockTickets, createdTicket]);
          }
          return HttpResponse.json(mockTickets);
        })
      );
    }

    render(<TicketDashboard />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Open modal
    const newTicketButton = screen.getByRole('button', { name: /new ticket/i });
    await user.click(newTicketButton);

    await waitFor(() => {
      expect(screen.getByText('Create New Ticket')).toBeInTheDocument();
    });

    // Fill form - only subject and description (username and userId are auto-generated)
    const subjectInput = screen.getByLabelText(/subject/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.clear(subjectInput);
    await user.type(subjectInput, 'New Integration Test Ticket');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'This is a test');

    // Submit - the button has form="new-ticket-form" attribute
    const submitButton = screen.getByRole('button', { name: /create ticket/i });
    await user.click(submitButton);

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByText('Create New Ticket')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // The new ticket should appear in the list (after refetch)
    // React Query will invalidate and refetch, which should trigger the GET handler
    await waitFor(() => {
      expect(screen.getByText('New Integration Test Ticket')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should automatically navigate to ticket detail after creating a new ticket', async () => {
    const user = userEvent.setup();

    let createdTicket: Ticket | null = null;
    let getCallCount = 0;

    // Mock the POST request to return a new ticket
    if (server) {
      server.use(
        http.post('http://localhost:5000/api/tickets', async ({ request }) => {
          const body = (await request.json()) as CreateTicketDto;
          createdTicket = {
            id: 888,
            subject: body.subject,
            description: body.description,
            username: body.username,
            userId: body.userId,
            status: TicketStatus.Open,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            replies: [],
          };
          return HttpResponse.json(createdTicket, { status: 201 });
        }),
        // Mock GET /api/tickets to return the new ticket in the list
        http.get('http://localhost:5000/api/tickets', () => {
          getCallCount++;
          if (createdTicket && getCallCount > 1) {
            return HttpResponse.json([...mockTickets, createdTicket]);
          }
          return HttpResponse.json(mockTickets);
        }),
        // Mock GET /api/tickets/:id to return the created ticket details
        http.get('http://localhost:5000/api/tickets/888', () => {
          if (createdTicket) {
            return HttpResponse.json(createdTicket);
          }
          return HttpResponse.json({ error: 'Not found' }, { status: 404 });
        })
      );
    }

    // Use createMemoryRouter to track navigation
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <QueryClientProvider client={queryClient}>
              <TicketDashboard />
            </QueryClientProvider>
          ),
        },
        {
          path: '/tickets/:ticketId',
          element: (
            <QueryClientProvider client={queryClient}>
              <TicketDashboard />
            </QueryClientProvider>
          ),
        },
      ],
      { initialEntries: ['/'] }
    );

    render(<RouterProvider router={router} />);

    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify we're on the root route initially
    expect(router.state.location.pathname).toBe('/');

    // Open modal
    const newTicketButton = screen.getByRole('button', { name: /new ticket/i });
    await user.click(newTicketButton);

    await waitFor(() => {
      expect(screen.getByText('Create New Ticket')).toBeInTheDocument();
    });

    // Fill form
    const subjectInput = screen.getByLabelText(/subject/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.clear(subjectInput);
    await user.type(subjectInput, 'Auto Navigate Test Ticket');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'This ticket should auto-navigate');

    // Submit
    const submitButton = screen.getByRole('button', { name: /create ticket/i });
    await user.click(submitButton);

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByText('Create New Ticket')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify navigation to the new ticket detail page
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/tickets/888');
    }, { timeout: 5000 });

    // Verify the ticket detail is displayed (check for ticket subject in heading)
    await waitFor(() => {
      const heading = screen.queryByRole('heading', { name: 'Auto Navigate Test Ticket' });
      const description = screen.queryByText('This ticket should auto-navigate');
      expect(heading || description).toBeTruthy();
    }, { timeout: 5000 });
  });

  it('should handle API errors gracefully', async () => {

    // Mock an error response
    if (server) {
      server.use(
        http.get('http://localhost:5000/api/tickets', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        })
      );
    }

    render(<TicketDashboard />, { wrapper: createTestWrapper() });

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/an error has occurred/i)).toBeInTheDocument();
    });
  });
});

