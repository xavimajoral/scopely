import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.ts';
import TicketNavigation from '@/components/TicketNavigation';
import TicketDetail from '@/components/TicketDetail';
import NewTicketModal from '@/components/NewTicketModal';
import styles from './TicketDashboard.module.css';

function TicketDashboard() {
  const queryClient = useQueryClient();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSelectTicket = (ticket: { id: number }) => {
    setSelectedTicketId(ticket.id);
  };

  const handleTicketUpdated = () => {
    // Invalidate and refetch both queries
    queryClient.invalidateQueries({ queryKey: ['unresolvedTickets'] });
    if (selectedTicketId) {
      queryClient.invalidateQueries({ queryKey: ['ticketDetail', selectedTicketId] });
    }
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
          onTicketResolved={() => setSelectedTicketId(null)}
        />
      </div>
      <NewTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTicketCreated={handleTicketUpdated}
      />
    </div>
  );
}

export default TicketDashboard;
