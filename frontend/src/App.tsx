import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Ticket } from './types';
import { apiService } from './services/api';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import NewTicketModal from './components/NewTicketModal';
import './App.css';

/**
 * Main application component
 */
function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Sidebar width state with localStorage persistence
  const getInitialWidth = () => {
    const saved = localStorage.getItem('ticketListWidth');
    return saved ? parseInt(saved, 10) : 300;
  };
  const [sidebarWidth, setSidebarWidth] = useState(getInitialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Load tickets on component mount and when updated
  const loadTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTickets = await apiService.getUnresolvedTickets();
      setTickets(fetchedTickets);

      // If selected ticket was updated, refresh it
      if (selectedTicket) {
        const updatedTicket = await apiService.getTicketById(selectedTicket.id);
        setSelectedTicket(updatedTicket);
      }
    } catch (err) {
      console.error('Error loading tickets:', err);
      setError('Failed to load tickets. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // Refresh tickets every 30 seconds
    const interval = setInterval(loadTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectTicket = async (ticket: Ticket) => {
    try {
      // Fetch full ticket details with replies
      const fullTicket = await apiService.getTicketById(ticket.id);
      setSelectedTicket(fullTicket);
    } catch (err) {
      console.error('Error loading ticket details:', err);
      setError('Failed to load ticket details.');
    }
  };

  const handleTicketUpdated = () => {
    loadTickets();
  };

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Resize handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    const minWidth = 200;
    const maxWidth = window.innerWidth * 0.6; // Max 60% of window width
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
      localStorage.setItem('ticketListWidth', newWidth.toString());
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (isLoading && tickets.length === 0) {
    return (
      <div className="app-loading">
        <div>Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="app">
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      <div className="app-container">
        <div 
          ref={sidebarRef}
          className="sidebar-container"
          style={{ width: `${sidebarWidth}px` }}
        >
          <TicketList
            tickets={tickets}
            selectedTicketId={selectedTicket?.id || null}
            onSelectTicket={handleSelectTicket}
            onCreateNew={handleCreateNew}
          />
          <div 
            className={`resize-handle ${isResizing ? 'resizing' : ''}`}
            onMouseDown={handleMouseDown}
          />
        </div>
        <TicketDetail
          ticket={selectedTicket}
          onTicketUpdated={handleTicketUpdated}
        />
      </div>
      <NewTicketModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onTicketCreated={handleTicketUpdated}
      />
    </div>
  );
}

export default App;
