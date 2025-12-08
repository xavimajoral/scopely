import React from 'react';
import { Ticket, TicketStatus } from '../types';
import './TicketList.css';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId: number | null;
  onSelectTicket: (ticket: Ticket) => void;
  onCreateNew: () => void;
}

/**
 * Component displaying the list of unresolved tickets
 */
const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onCreateNew,
}) => {
  const getStatusColor = (status: TicketStatus): string => {
    switch (status) {
      case TicketStatus.Open:
        return '#ff9800';
      case TicketStatus.InResolution:
        return '#2196f3';
      case TicketStatus.Resolved:
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: TicketStatus): string => {
    switch (status) {
      case TicketStatus.Open:
        return 'Open';
      case TicketStatus.InResolution:
        return 'In Resolution';
      case TicketStatus.Resolved:
        return 'Resolved';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="ticket-list">
      <button className="new-ticket-button" onClick={onCreateNew}>
        New ticket
      </button>
      <div className="tickets-container">
        {tickets.length === 0 ? (
          <div className="no-tickets">No unresolved tickets</div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`ticket-item ${
                selectedTicketId === ticket.id ? 'selected' : ''
              }`}
              onClick={() => onSelectTicket(ticket)}
            >
              <div className="ticket-content">
                <div className="ticket-subject">{ticket.subject}</div>
                <div className="ticket-user">
                  {ticket.username} - {ticket.userId}
                </div>
              </div>
              <div className="ticket-meta">
                <div
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(ticket.status) }}
                >
                  {getStatusText(ticket.status)}
                </div>
                <div className="avatar">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketList;

