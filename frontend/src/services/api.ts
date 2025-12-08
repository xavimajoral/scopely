import { Ticket, CreateTicketDto, CreateReplyDto, Reply } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7000/api';

/**
 * API service for interacting with the backend
 */
class ApiService {
  private async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Get all unresolved tickets
   */
  async getUnresolvedTickets(): Promise<Ticket[]> {
    return this.fetchWithErrorHandling<Ticket[]>('/tickets');
  }

  /**
   * Get a ticket by ID
   */
  async getTicketById(id: number): Promise<Ticket> {
    return this.fetchWithErrorHandling<Ticket>(`/tickets/${id}`);
  }

  /**
   * Create a new ticket
   */
  async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    return this.fetchWithErrorHandling<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  /**
   * Resolve a ticket
   */
  async resolveTicket(id: number): Promise<Ticket> {
    return this.fetchWithErrorHandling<Ticket>(`/tickets/${id}/resolve`, {
      method: 'POST',
    });
  }

  /**
   * Add a reply to a ticket
   */
  async addReply(ticketId: number, dto: CreateReplyDto): Promise<Reply> {
    return this.fetchWithErrorHandling<Reply>(`/tickets/${ticketId}/replies`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }
}

export const apiService = new ApiService();

