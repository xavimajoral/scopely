using SupportTicketingSystem.Domain;

namespace SupportTicketingSystem.Services;

/// <summary>
/// Service interface for ticket business logic
/// </summary>
public interface ITicketService
{
    /// <summary>
    /// Get all unresolved tickets
    /// </summary>
    Task<IEnumerable<Ticket>> GetUnresolvedTicketsAsync();

    /// <summary>
    /// Get a ticket by ID with its replies
    /// </summary>
    Task<Ticket?> GetTicketByIdAsync(int id);

    /// <summary>
    /// Create a new ticket
    /// </summary>
    Task<Ticket> CreateTicketAsync(string subject, string description, string username, string userId);

    /// <summary>
    /// Mark a ticket as resolved
    /// </summary>
    Task<Ticket> ResolveTicketAsync(int ticketId);

    /// <summary>
    /// Add a reply to a ticket (automatically updates status to InResolution if from agent)
    /// </summary>
    Task<Reply> AddReplyAsync(int ticketId, string message, string username, string userId, bool isFromAgent);
}

