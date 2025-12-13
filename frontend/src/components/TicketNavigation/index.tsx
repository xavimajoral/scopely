import type { Ticket } from '@/types.ts';
import TicketList from '@/components/TicketList';
import { useResizableSidebar } from '@/hooks/useResizableSidebar';
import styles from './TicketNavigation.module.css';

interface TicketNavigationProps {
  tickets: Ticket[];
  selectedTicketId: number | null;
  isFetching: boolean;
  onSelectTicket: (ticket: Ticket) => void;
  onCreateNew: () => void;
}

function TicketNavigation({
  tickets,
  selectedTicketId,
  isFetching,
  onSelectTicket,
  onCreateNew,
}: TicketNavigationProps) {
  
  const { sidebarWidth, isResizing, sidebarRef, handleMouseDown } = useResizableSidebar();

  return (
    <div
      ref={sidebarRef}
      className={styles.sidebarContainer}
      style={{ width: `${sidebarWidth}px` }}
    >
      <div>{isFetching ? 'Updating...' : ''}</div>
      <TicketList
        tickets={tickets}
        selectedTicketId={selectedTicketId}
        onSelectTicket={onSelectTicket}
        onCreateNew={onCreateNew}
      />
      <div
        className={`${styles.resizeHandle} ${isResizing ? styles.resizing : ''}`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

export default TicketNavigation;

