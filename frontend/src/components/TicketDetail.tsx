import React, { useState } from 'react';
import { Ticket, Reply, CreateReplyDto } from '../types';
import { apiService } from '../services/api';
import './TicketDetail.css';

interface TicketDetailProps {
  ticket: Ticket | null;
  onTicketUpdated: () => void;
}

/**
 * Component displaying ticket details and replies thread
 */
const TicketDetail: React.FC<TicketDetailProps> = ({
  ticket,
  onTicketUpdated,
}) => {
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  if (!ticket) {
    return (
      <div className="ticket-detail empty">
        <div className="empty-state">Select a ticket to view details</div>
      </div>
    );
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const replyDto: CreateReplyDto = {
        message: replyMessage,
        username: 'CS Agent',
        userId: 'agent001',
        isFromAgent: true,
      };

      await apiService.addReply(ticket.id, replyDto);
      setReplyMessage('');
      onTicketUpdated();
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to add reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (isResolving) return;

    if (!window.confirm('Are you sure you want to mark this ticket as resolved?')) {
      return;
    }

    setIsResolving(true);
    try {
      await apiService.resolveTicket(ticket.id);
      onTicketUpdated();
    } catch (error) {
      console.error('Error resolving ticket:', error);
      alert('Failed to resolve ticket. Please try again.');
    } finally {
      setIsResolving(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="ticket-detail">
      <div className="ticket-header">
        <h1 className="ticket-title">{ticket.subject}</h1>
        <button
          className="resolve-button"
          onClick={handleResolve}
          disabled={isResolving || ticket.status === 2}
        >
          {isResolving ? 'Resolving...' : 'Resolve'}
        </button>
      </div>

      <div className="replies-thread">
        {/* Initial ticket description as first message */}
        <div className="reply-item customer">
          <div className="reply-content">
            <div className="reply-message">{ticket.description}</div>
            <div className="reply-meta">
              <span className="reply-author">{ticket.username}</span>
              <span className="reply-date">{formatDate(ticket.createdAt)}</span>
            </div>
          </div>
          <div className="reply-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        {/* Replies */}
        {ticket.replies.map((reply) => (
          <div
            key={reply.id}
            className={`reply-item ${reply.isFromAgent ? 'agent' : 'customer'}`}
          >
            <div className="reply-content">
              <div className="reply-message">{reply.message}</div>
              <div className="reply-meta">
                <span className="reply-author">
                  {reply.isFromAgent ? 'CS Agent' : reply.username}
                </span>
                <span className="reply-date">{formatDate(reply.createdAt)}</span>
              </div>
            </div>
            <div className="reply-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
        ))}

        {/* Reply form */}
        <div className="reply-form-container">
          <form onSubmit={handleReplySubmit} className="reply-form">
            <textarea
              className="reply-input"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
              rows={4}
              disabled={isSubmitting}
            />
            <div className="reply-form-footer">
              <div className="reply-author-info">
                <span>CS Agent</span>
                <div className="reply-avatar small">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                className="send-button"
                disabled={!replyMessage.trim() || isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;

