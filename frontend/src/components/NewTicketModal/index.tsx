import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateTicketDto } from '@/types.ts';
import { apiService } from '@/services/api.ts';
import Modal from '@/components/Modal';
import styles from './NewTicketModal.module.css';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: (ticketId: number) => void;
}

const NewTicketModal: React.FC<NewTicketModalProps> = ({ isOpen, onClose, onTicketCreated }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
  });

  // Mutation for creating a new ticket
  const createTicketMutation = useMutation({
    mutationFn: async (dto: CreateTicketDto) => {
      return await apiService.createTicket(dto);
    },
    onSuccess: (createdTicket) => {
      // Invalidate and refetch the tickets list to show the new ticket
      queryClient.invalidateQueries({ queryKey: ['unresolvedTickets'] });
      setFormData({
        subject: '',
        description: '',
      });
      onTicketCreated(createdTicket.id);
      onClose();
    },
    onError: (error) => {
      console.error('Error creating ticket:', error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) {
      return;
    }

    // Auto-generate username and userId (different formats)
    const timestamp = String(Date.now() % 10000).padStart(4, '0'); // 4-digit timestamp
    const randomId = Math.random().toString(36).substring(2, 9); // Random alphanumeric string
    const ticketDto: CreateTicketDto = {
      subject: formData.subject.trim(),
      description: formData.description.trim(),
      username: `Customer ${timestamp}`,
      userId: `usr-${randomId}`,
    };

    createTicketMutation.mutate(ticketDto);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const footer = (
    <>
      <button
        type="button"
        className={styles.cancelButton}
        onClick={onClose}
        disabled={createTicketMutation.isPending}
      >
        Cancel
      </button>
      <button
        type="submit"
        form="new-ticket-form"
        className={styles.submitButton}
        disabled={createTicketMutation.isPending}
      >
        {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
      </button>
    </>
  );

  const subject = (
    <div className={styles.formGroup}>
      <label htmlFor="subject">Subject *</label>
      <input
        type="text"
        id="subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        required
        maxLength={200}
      />
    </div>
  );

  const description = (
    <div className={styles.formGroup}>
      <label htmlFor="description">Description *</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        rows={6}
      />
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Ticket" footer={footer}>
      <form id="new-ticket-form" onSubmit={handleSubmit}>
        {subject}
        {description}
        {createTicketMutation.isError && (
          <div className={styles.errorMessage}>Failed to create ticket. Please try again.</div>
        )}
      </form>
    </Modal>
  );
};

export default NewTicketModal;
