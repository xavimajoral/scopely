import { http, HttpResponse } from 'msw';
import type { Ticket, Reply } from '@/types';
import { TicketStatus } from '@/types';

const API_BASE_URL = 'http://localhost:5000/api';

// Mock data
export const mockTickets: Ticket[] = [
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

export const mockTicketDetail: Ticket = {
  id: 1,
  subject: 'Test Ticket 1',
  description: 'Description 1',
  username: 'user1',
  userId: 'user123',
  status: TicketStatus.Open,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  replies: [
    {
      id: 1,
      ticketId: 1,
      message: 'First reply',
      username: 'CS Agent',
      userId: 'agent001',
      isFromAgent: true,
      createdAt: new Date().toISOString(),
    },
  ],
};

// MSW request handlers
export const handlers = [
  // GET /api/tickets - Get unresolved tickets
  http.get(`${API_BASE_URL}/tickets`, () => {
    return HttpResponse.json(mockTickets);
  }),

  // GET /api/tickets/:id - Get ticket by ID
  http.get(`${API_BASE_URL}/tickets/:id`, ({ params }) => {
    const { id } = params;
    if (id === '1') {
      return HttpResponse.json(mockTicketDetail);
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // POST /api/tickets - Create new ticket
  http.post(`${API_BASE_URL}/tickets`, async ({ request }) => {
    const body = await request.json();
    const newTicket: Ticket = {
      id: Date.now(),
      subject: (body as any).subject,
      description: (body as any).description,
      username: (body as any).username,
      userId: (body as any).userId,
      status: TicketStatus.Open,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
    };
    return HttpResponse.json(newTicket, { status: 201 });
  }),

  // POST /api/tickets/:id/resolve - Resolve ticket
  http.post(`${API_BASE_URL}/tickets/:id/resolve`, ({ params }) => {
    const { id } = params;
    const resolvedTicket: Ticket = {
      ...mockTicketDetail,
      id: Number(id),
      status: TicketStatus.Resolved,
    };
    return HttpResponse.json(resolvedTicket);
  }),

  // POST /api/tickets/:id/replies - Add reply
  http.post(`${API_BASE_URL}/tickets/:id/replies`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const newReply: Reply = {
      id: Date.now(),
      ticketId: Number(id),
      message: (body as any).message,
      username: (body as any).username,
      userId: (body as any).userId,
      isFromAgent: (body as any).isFromAgent,
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json(newReply, { status: 201 });
  }),
];

