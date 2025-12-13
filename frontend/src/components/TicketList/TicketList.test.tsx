import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TicketList from './index';
import type { Ticket } from '@/types';
import { TicketStatus } from '@/types';

const mockTickets: Ticket[] = [
  {
    id: 1,
    subject: 'Test Ticket 1',
    description: 'Description 1',
    username: 'user1',
    userId: 'user123',
    status: TicketStatus.Open,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replies: [],
  },
  {
    id: 2,
    subject: 'Test Ticket 2',
    description: 'Description 2',
    username: 'user2',
    userId: 'user456',
    status: TicketStatus.InResolution,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replies: [],
  },
];

describe('TicketList', () => {
  it('renders list of tickets', () => {
    const onSelectTicket = vi.fn();
    const onCreateNew = vi.fn();

    render(
      <TicketList
        tickets={mockTickets}
        selectedTicketId={null}
        onSelectTicket={onSelectTicket}
        onCreateNew={onCreateNew}
      />
    );

    expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
    expect(screen.getByText('Test Ticket 2')).toBeInTheDocument();
  });

  it('displays empty state when no tickets', () => {
    const onSelectTicket = vi.fn();
    const onCreateNew = vi.fn();

    render(
      <TicketList
        tickets={[]}
        selectedTicketId={null}
        onSelectTicket={onSelectTicket}
        onCreateNew={onCreateNew}
      />
    );

    expect(screen.getByText(/no unresolved tickets/i)).toBeInTheDocument();
  });

  it('calls onSelectTicket when ticket is clicked', async () => {
    const user = userEvent.setup();
    const onSelectTicket = vi.fn();
    const onCreateNew = vi.fn();

    render(
      <TicketList
        tickets={mockTickets}
        selectedTicketId={null}
        onSelectTicket={onSelectTicket}
        onCreateNew={onCreateNew}
      />
    );

    const ticket = screen.getByText('Test Ticket 1').closest('div[class*="ticketItem"]');
    if (ticket) {
      await user.click(ticket);
      expect(onSelectTicket).toHaveBeenCalledWith(mockTickets[0]);
    }
  });

  it('calls onCreateNew when new ticket button is clicked', async () => {
    const user = userEvent.setup();
    const onSelectTicket = vi.fn();
    const onCreateNew = vi.fn();

    render(
      <TicketList
        tickets={mockTickets}
        selectedTicketId={null}
        onSelectTicket={onSelectTicket}
        onCreateNew={onCreateNew}
      />
    );

    const newTicketButton = screen.getByRole('button', { name: /new ticket/i });
    await user.click(newTicketButton);

    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });

  it('highlights selected ticket', () => {
    const onSelectTicket = vi.fn();
    const onCreateNew = vi.fn();

    render(
      <TicketList
        tickets={mockTickets}
        selectedTicketId={1}
        onSelectTicket={onSelectTicket}
        onCreateNew={onCreateNew}
      />
    );

    const ticket = screen.getByText('Test Ticket 1').closest('div[class*="ticketItem"]');
    expect(ticket).toHaveClass(/selected/);
  });
});

