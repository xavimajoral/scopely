import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TicketStatus, type Ticket } from '@/types.ts';
import { apiService } from '@/services/api.ts';
import { DicebearAvatar } from '@/components/DicebearAvatar';
import ReplyForm from '@/components/ReplyForm';
import ConfirmModal from '@/components/ConfirmModal';
import styles from './TicketDetail.module.css';

interface TicketDetailProps {
  ticket: Ticket | null;
  onTicketUpdated: () => void;
  onTicketResolved?: () => void;
}

const AGENT_AVATAR_URL = 'https://api.dicebear.com/9.x/avataaars/svg?seed=Luis';

const TicketDetail: React.FC<TicketDetailProps> = ({
  ticket,
  onTicketUpdated,
  onTicketResolved,
}) => {
  const queryClient = useQueryClient();
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  // Mutation for resolving a ticket
  const resolveTicketMutation = useMutation({
    mutationFn: async () => {
      if (!ticket) throw new Error('No ticket selected');
      return await apiService.resolveTicket(ticket.id);
    },
    onSuccess: () => {
      // Invalidate both queries to reflect the resolved status
      queryClient.invalidateQueries({ queryKey: ['ticketDetail', ticket?.id] });
      queryClient.invalidateQueries({ queryKey: ['unresolvedTickets'] });
      onTicketUpdated();
      // Clear selection to show empty state
      onTicketResolved?.();
    },
    onError: (error) => {
      console.error('Error resolving ticket:', error);
      alert('Failed to resolve ticket. Please try again.');
    },
  });

  if (!ticket || (ticket.status as TicketStatus) === TicketStatus.Resolved) {
    return (
      <div className={`${styles.ticketDetail} ${styles.empty}`}>
        <div className={styles.emptyState}>Select a ticket to view details</div>
      </div>
    );
  }

  const handleResolveClick = () => {
    setIsResolveModalOpen(true);
  };

  const handleResolveConfirm = () => {
    if (resolveTicketMutation.isPending) {
      return;
    }
    resolveTicketMutation.mutate();
    setIsResolveModalOpen(false);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const ticketHeader = (
    <div className={styles.ticketHeader}>
      <h1 className={styles.ticketTitle}>{ticket.subject}</h1>
      <button
        className={styles.resolveButton}
        onClick={handleResolveClick}
        disabled={resolveTicketMutation.isPending || ticket.status === TicketStatus.Resolved}
      >
        {resolveTicketMutation.isPending ? 'Resolving...' : 'Resolve'}
      </button>
    </div>
  );

  // Merge initial customer message with all agent replies into a single array
  const allMessages = [
    {
      id: `ticket-${ticket.id}`,
      username: ticket.username,
      userId: ticket.userId,
      message: ticket.description,
      createdAt: ticket.createdAt,
      isFromAgent: false,
      isInitial: true,
    },
    ...ticket.replies,
  ];

  return (
    <div className={styles.ticketDetail}>
      {ticketHeader}
      <div className={styles.repliesThread}>
        {allMessages.map((item) => {
          const isAgent = item.isFromAgent;
          const isInitial = 'isInitial' in item && item.isInitial;

          return (
            <div
              key={item.id}
              className={`${styles.replyItem} ${isAgent ? styles.agent : ''}`}
            >
              // Customer message
              {!isAgent && (
                <div className={styles.avatar}>
                  {isInitial ? (
                    <DicebearAvatar seed={String(ticket.id)} />
                  ) : (
                    <img
                      width={64}
                      src={AGENT_AVATAR_URL}
                      alt="avatar"
                    />
                  )}
                </div>
              )}
              // Agent message
              <div className={styles.replyContent}>
                <span className={styles.replyAuthor}>
                  {isAgent ? 'CS Agent' : item.username}
                  {!isAgent && <span className={styles.userId}> {item.userId}</span>}
                </span>
                <div
                  className={`${styles.replyMessage} ${isAgent ? styles.replyMessageAgent : ''}`}
                >
                  {item.message}
                </div>
                <div className={styles.replyMeta}>
                  <span className={styles.replyDate}>{formatDate(item.createdAt)}</span>
                </div>
              </div>
              {isAgent && (
                <div className={styles.avatar}>
                  <img
                    width={64}
                    src={AGENT_AVATAR_URL}
                    alt="avatar"
                  />
                </div>
              )}
            </div>
          );
        })}

        <ReplyForm ticket={ticket} onTicketUpdated={onTicketUpdated} />
      </div>
      <ConfirmModal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        onConfirm={handleResolveConfirm}
        title="Resolve Ticket"
        message="Are you sure you want to mark this ticket as resolved?"
        confirmText="Resolve"
        cancelText="Cancel"
        isLoading={resolveTicketMutation.isPending}
      />
    </div>
  );
};

export default TicketDetail;
