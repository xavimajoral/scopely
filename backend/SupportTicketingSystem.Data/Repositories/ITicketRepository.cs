using SupportTicketingSystem.Domain;

namespace SupportTicketingSystem.Data.Repositories;

/// <summary>
/// Repository interface for Ticket operations
/// </summary>
public interface ITicketRepository
{
    /// <summary>
    /// Get all unresolved tickets (Open or InResolution status)
    /// </summary>
    Task<IEnumerable<Ticket>> GetUnresolvedTicketsAsync();

    /// <summary>
    /// Get a ticket by ID with its replies
    /// </summary>
    Task<Ticket?> GetTicketByIdAsync(int id);

    /// <summary>
    /// Create a new ticket
    /// </summary>
    Task<Ticket> CreateTicketAsync(Ticket ticket);

    /// <summary>
    /// Update an existing ticket
    /// </summary>
    Task<Ticket> UpdateTicketAsync(Ticket ticket);

    /// <summary>
    /// Save changes to the database
    /// </summary>
    Task<int> SaveChangesAsync();
}

