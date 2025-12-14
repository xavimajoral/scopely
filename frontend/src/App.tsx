import { Routes, Route, Navigate } from 'react-router-dom';
import TicketDashboard from './components/TicketDashboard';

/**
 * Root App component with React Router setup
 *
 * Routes:
 * - "/" - Dashboard (no ticket selected)
 * - "/tickets/:ticketId" - View specific ticket
 * - "*" - Catch-all, redirects to home
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<TicketDashboard />} />
      <Route path="/tickets/:ticketId" element={<TicketDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

