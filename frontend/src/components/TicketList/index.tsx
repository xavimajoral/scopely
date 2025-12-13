import React from 'react';
import type { Ticket } from '@/types';
import { TicketStatus } from '@/types';
import { DicebearAvatar } from '@/components/DicebearAvatar';
import styles from './TicketList.module.css';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId: number | null;
  onSelectTicket: (ticket: Ticket) => void;
  onCreateNew: () => void;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onCreateNew,
}) => {
  const getStatusClassName = (status: TicketStatus): string => {
    switch (status) {
      case TicketStatus.Open:
        return styles.statusOpen;
      case TicketStatus.InResolution:
        return styles.statusInResolution;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusText = (status: TicketStatus): string => {
    switch (status) {
      case TicketStatus.Open:
        return 'open';
      case TicketStatus.InResolution:
        return 'in resolution';
      default:
        return 'unknown';
    }
  };

  const ticketList = (tickets: Ticket[]) => {
    return tickets.map((ticket) => (
      <div
        key={ticket.id}
        className={`${styles.ticketItem} ${selectedTicketId === ticket.id ? styles.selected : ''}`}
        onClick={() => onSelectTicket(ticket)}
      >
        <div className={styles.ticketContent}>
          <div className={styles.ticketSubject}>{ticket.subject}</div>
          <div className={styles.ticketUser}>
            {ticket.username} - {ticket.userId}
          </div>
        </div>
        <div className={styles.ticketMeta}>
          <div className={`${styles.statusBadge} ${getStatusClassName(ticket.status)}`}>
            {getStatusText(ticket.status)}
          </div>
          <div className={styles.avatar}>
            <DicebearAvatar seed={ticket.id.toString()} size={48} />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className={styles.ticketList}>
      <button className={styles.newTicketButton} onClick={onCreateNew}>
        + New ticket
      </button>
      <div className={styles.ticketsContainer}>
        {tickets.length === 0 ? (
          <div className={styles.noTickets}>No unresolved tickets</div>
        ) : (
          ticketList(tickets)
        )}
      </div>
    </div>
  );
};

export default TicketList;
