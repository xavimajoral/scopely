import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import { apiService } from '@/services/api.ts';
import TicketNavigation from '@/components/TicketNavigation';
import TicketDetail from '@/components/TicketDetail';
import NewTicketModal from '@/components/NewTicketModal';
import styles from './TicketDashboard.module.css';

function TicketDashboard() {
  const queryClient = useQueryClient();
  const { ticketId } = useParams<{ ticketId?: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert URL parameter to number or null
  const selectedTicketId = ticketId ? parseInt(ticketId, 10) : null;

  // Query for unresolved tickets with automatic refetching every 30 seconds and on windows focus
  const {
    isPending,
    error,
    data: tickets,
    isFetching,
  } = useQuery({
    queryKey: ['unresolvedTickets'],
    queryFn: async () => {
      return await apiService.getUnresolvedTickets();
    },
    // Refetch every 30 seconds to keep in sync with database
    refetchInterval: 30 * 1000,
    // Refetch when window regains focus
    refetchOnWindowFocus: true,
  });

  // Query for selected ticket details
  const {
    data: selectedTicket,
    isLoading: isLoadingTicket,
    error: ticketError,
  } = useQuery({
    queryKey: ['ticketDetail', selectedTicketId],
    queryFn: async () => {
      if (!selectedTicketId) return null;
      return await apiService.getTicketById(selectedTicketId);
    },
    enabled: selectedTicketId !== null,
    // Refetch when window regains focus to catch updates from other tabs/windows
    refetchOnWindowFocus: true,
  });

  // Navigate to ticket URL when ticket is selected
  const handleSelectTicket = (ticket: { id: number }) => {
    navigate(`/tickets/${ticket.id}`);
  };

  const handleTicketUpdated = () => {
    // Invalidate and refetch both queries
    queryClient.invalidateQueries({ queryKey: ['unresolvedTickets'] });
    if (selectedTicketId) {
      queryClient.invalidateQueries({ queryKey: ['ticketDetail', selectedTicketId] });
    }
  };

  const handleTicketCreated = (ticketId: number) => {
    queryClient.invalidateQueries({ queryKey: ['unresolvedTickets'] });
    navigate(`/tickets/${ticketId}`);
  };

  if (isPending) {
    return (
      <div className={styles.loading}>
        <div>Loading tickets...</div>
      </div>
    );
  }

  const showError = (
    <div className={styles.error}>
      {error && `An error has occurred: ${error.message}`}
      {ticketError && `Failed to load ticket details: ${ticketError.message}`}
    </div>
  );

  const isLoadingTicketDetails = (
    <div className={styles.loading}>
      <div>Loading ticket details...</div>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      {(error || ticketError) && showError}
      <div className={styles.dashboard}>
        <TicketNavigation
          tickets={tickets || []}
          selectedTicketId={selectedTicketId}
          isFetching={isFetching}
          onSelectTicket={handleSelectTicket}
          onCreateNew={() => setIsModalOpen(true)}
        />
        {isLoadingTicket && selectedTicketId && isLoadingTicketDetails}
        <TicketDetail
          ticket={selectedTicket || null}
          onTicketUpdated={handleTicketUpdated}
          onTicketResolved={() => navigate('/')}
          hasTickets={(tickets || []).length > 0}
        />
      </div>
      <NewTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
}

export default TicketDashboard;
