import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReplyForm from './index';
import type { Ticket, CreateReplyDto } from '@/types';
import { TicketStatus } from '@/types';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';

const mockTicket: Ticket = {
  id: 1,
  subject: 'Test Ticket',
  description: 'Test Description',
  username: 'testuser',
  userId: 'user123',
  status: TicketStatus.Open,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  replies: [],
};

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ReplyForm Integration Tests', () => {
  beforeEach(() => {
    // Reset MSW handlers before each test
    server.resetHandlers();
  });

  it('should submit a reply and update the ticket', async () => {
    const user = userEvent.setup();
    const onTicketUpdated = vi.fn();

    // Mock the reply endpoint
    let replySubmitted = false;
    server.use(
      http.post('http://localhost:5000/api/tickets/1/replies', async ({ request }) => {
        replySubmitted = true;
        const body = (await request.json()) as CreateReplyDto;
        return HttpResponse.json(
          {
            id: 1,
            ticketId: 1,
            message: body.message,
            username: body.username,
            userId: body.userId,
            isFromAgent: body.isFromAgent,
            createdAt: new Date().toISOString(),
          },
          { status: 201 }
        );
      })
    );

    render(<ReplyForm ticket={mockTicket} onTicketUpdated={onTicketUpdated} />, {
      wrapper: createTestWrapper(),
    });

    const textarea = screen.getByPlaceholderText(/type your reply/i);
    await user.type(textarea, 'This is an integration test reply');

    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(replySubmitted).toBe(true);
    });

    // Check that the callback was called
    expect(onTicketUpdated).toHaveBeenCalled();

    // Textarea should be cleared after successful submission
    await waitFor(() => {
      expect(textarea).toHaveValue('');
    });
  });

  it('should submit reply on Ctrl+Enter keyboard shortcut', async () => {
    const user = userEvent.setup();
    const onTicketUpdated = vi.fn();

    let replySubmitted = false;
    server.use(
      http.post('http://localhost:5000/api/tickets/1/replies', async () => {
        replySubmitted = true;
        return HttpResponse.json(
          {
            id: 1,
            ticketId: 1,
            message: 'Test reply',
            username: 'CS Agent',
            userId: 'agent001',
            isFromAgent: true,
            createdAt: new Date().toISOString(),
          },
          { status: 201 }
        );
      })
    );

    render(<ReplyForm ticket={mockTicket} onTicketUpdated={onTicketUpdated} />, {
      wrapper: createTestWrapper(),
    });

    const textarea = screen.getByPlaceholderText(/type your reply/i);
    await user.type(textarea, 'Reply via keyboard shortcut');
    
    // Use keyboard shortcut - Ctrl+Enter (or Cmd+Enter on Mac)
    await user.keyboard('{Control>}{Enter}{/Control}');

    await waitFor(() => {
      expect(replySubmitted).toBe(true);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(onTicketUpdated).toHaveBeenCalled();
    });
  });

  it('should handle API errors when submitting reply', async () => {
    const user = userEvent.setup();
    const onTicketUpdated = vi.fn();

    // Mock error response
    server.use(
      http.post('http://localhost:5000/api/tickets/1/replies', () => {
        return HttpResponse.json({ error: 'Failed to add reply' }, { status: 500 });
      })
    );

    // Mock window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<ReplyForm ticket={mockTicket} onTicketUpdated={onTicketUpdated} />, {
      wrapper: createTestWrapper(),
    });

    const textarea = screen.getByPlaceholderText(/type your reply/i);
    await user.type(textarea, 'This will fail');
    await user.click(screen.getByRole('button', { name: /send/i }));

    // Should show alert on error
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to add reply. Please try again.');
    });

    alertSpy.mockRestore();
  });
});

