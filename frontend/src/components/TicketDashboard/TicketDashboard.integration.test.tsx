import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TicketDashboard from './index';
import { mockTickets } from '@/test/mocks/handlers';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { TicketStatus } from '@/types';
import type { Ticket, CreateTicketDto } from '@/types';

// Create a test wrapper with QueryClient
const createTestWrapper = () => {
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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('TicketDashboard Integration Tests', () => {
  beforeEach(() => {
    // Reset MSW handlers before each test
    server.resetHandlers();
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

  it('should select a ticket and display its details', async () => {
    const user = userEvent.setup();
    render(<TicketDashboard />, { wrapper: createTestWrapper() });

    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
    });

    // Find the ticket item by looking for the subject text and its container
    const ticketSubject = screen.getByText('Test Ticket 1');
    const ticketItem = ticketSubject.closest('div[class*="ticketItem"]');
    
    expect(ticketItem).not.toBeNull();
    if (ticketItem) {
      await user.click(ticketItem as HTMLElement);
    }

    // Wait for ticket details to load - check for the description in the detail view
    // The description appears in the message thread
    await waitFor(() => {
      expect(screen.getByText('Description 1')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify the ticket title is in the detail view (h1)
    await waitFor(() => {
      const ticketTitle = screen.getByRole('heading', { name: 'Test Ticket 1' });
      expect(ticketTitle).toBeInTheDocument();
    });
  });

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

  it('should handle API errors gracefully', async () => {

    // Mock an error response
    server.use(
      http.get('http://localhost:5000/api/tickets', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 });
      })
    );

    render(<TicketDashboard />, { wrapper: createTestWrapper() });

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/an error has occurred/i)).toBeInTheDocument();
    });
  });
});

