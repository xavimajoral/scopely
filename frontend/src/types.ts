// Type definitions for the application

export enum TicketStatus {
  Open = 'OPEN',
  InResolution = 'IN_RESOLUTION',
  Resolved = 'RESOLVED',
}

export interface Ticket {
    id: number;
    subject: string;
    description: string;
    username: string;
    userId: string;
    status: TicketStatus;
    createdAt: string;
    updatedAt: string;
    replies: Reply[];
}

export interface Reply {
    id: number;
    ticketId: number;
    message: string;
    username: string;
    userId: string;
    isFromAgent: boolean;
    createdAt: string;
}

export interface CreateTicketDto {
    subject: string;
    description: string;
    username: string;
    userId: string;
}

export interface CreateReplyDto {
    message: string;
    username: string;
    userId: string;
    isFromAgent: boolean;
}

