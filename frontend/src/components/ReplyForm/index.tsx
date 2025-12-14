import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Ticket, CreateReplyDto } from '@/types.ts';
import { apiService } from '@/services/api.ts';
import styles from './ReplyForm.module.css';

interface ReplyFormProps {
  ticket: Ticket;
  onTicketUpdated: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ ticket, onTicketUpdated }) => {
  const queryClient = useQueryClient();
  const [replyMessage, setReplyMessage] = useState('');

  // Mutation for adding an Agent reply
  const addAgentReplyMutation = useMutation({
    mutationFn: async (dto: CreateReplyDto) => {
      return await apiService.addReply(ticket.id, dto);
    },
    onSuccess: () => {
      // Invalidate and refetch the ticket query to get updated replies
      queryClient.invalidateQueries({ queryKey: ['ticketDetail', ticket.id] });
      // Also invalidate the tickets list in case the ticket was updated
      queryClient.invalidateQueries({ queryKey: ['unresolvedTickets'] });
      setReplyMessage('');
      onTicketUpdated();
    },
    onError: (error) => {
      console.error('Error adding reply:', error);
      alert('Failed to add reply. Please try again.');
    },
  });

  const submitReply = () => {
    if (!replyMessage.trim() || addAgentReplyMutation.isPending) return;

    const replyDto: CreateReplyDto = {
      message: replyMessage,
      username: 'CS Agent',
      userId: 'agent001',
      isFromAgent: true,
    };

    addAgentReplyMutation.mutate(replyDto);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReply();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter (or Cmd+Enter on Mac)
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitReply();
    }
  };

  const replyFormFooter = (
    <div className={styles.replyFormFooter}>
      <button
        type="submit"
        className={styles.sendButton}
        disabled={!replyMessage.trim() || addAgentReplyMutation.isPending}
      >
        {addAgentReplyMutation.isPending ? 'Sending...' : 'Send'}
      </button>
      <div className={styles.replyAuthorInfo}>
        <span>CS Agent</span>
        <div className={styles.avatar}>
          <img width={40} src="https://api.dicebear.com/9.x/avataaars/svg?seed=Luis" alt="avatar" />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.replyFormContainer}>
      <form onSubmit={handleReplySubmit} className={styles.replyForm}>
        <textarea
          id="reply-message"
          name="replyMessage"
          className={styles.replyInput}
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your reply here... (Ctrl+Enter/Cmd+Enter to send)"
          rows={4}
          disabled={addAgentReplyMutation.isPending}
        />
        {replyFormFooter}
      </form>
    </div>
  );
};

export default ReplyForm;
