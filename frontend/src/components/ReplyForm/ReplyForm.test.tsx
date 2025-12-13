import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReplyForm from './index';
import type { Ticket } from '@/types';
import { TicketStatus } from '@/types';

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

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ReplyForm', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    // Restore fetch before each test
    global.fetch = originalFetch;
  });

  afterEach(() => {
    // Ensure fetch is always restored
    global.fetch = originalFetch;
  });

  it('renders the reply form', () => {
    const onTicketUpdated = vi.fn();
    render(<ReplyForm ticket={mockTicket} onTicketUpdated={onTicketUpdated} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByPlaceholderText(/type your reply/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('disables send button when message is empty', () => {
    const onTicketUpdated = vi.fn();
    render(<ReplyForm ticket={mockTicket} onTicketUpdated={onTicketUpdated} />, {
      wrapper: createWrapper(),
    });

    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it('enables send button when message has content', async () => {
    const user = userEvent.setup();
    const onTicketUpdated = vi.fn();
    render(<ReplyForm ticket={mockTicket} onTicketUpdated={onTicketUpdated} />, {
      wrapper: createWrapper(),
    });

    const textarea = screen.getByPlaceholderText(/type your reply/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    await user.type(textarea, 'Test reply message');

    expect(sendButton).not.toBeDisabled();
  });

  it('submits form on Ctrl+Enter', async () => {
    const user = userEvent.setup();
    const onTicketUpdated = vi.fn();
    
    // Mock the API call to succeed
    const mockReply = {
      id: 1,
      ticketId: 1,
      message: 'Test reply',
      username: 'CS Agent',
      userId: 'agent001',
      isFromAgent: true,
      createdAt: new Date().toISOString(),
    };
    
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockReply,
    });
    
    global.fetch = mockFetch as any;

    render(<ReplyForm ticket={mockTicket} onTicketUpdated={onTicketUpdated} />, {
      wrapper: createWrapper(),
    });

    const textarea = screen.getByPlaceholderText(/type your reply/i);
    await user.type(textarea, 'Test reply');
    await user.keyboard('{Control>}{Enter}{/Control}');

    // Wait for the mutation to complete and textarea to be cleared
    await waitFor(() => {
      expect(textarea).toHaveValue('');
    }, { timeout: 3000 });

    // Verify the callback was called
    await waitFor(() => {
      expect(onTicketUpdated).toHaveBeenCalled();
    });
  });
});

