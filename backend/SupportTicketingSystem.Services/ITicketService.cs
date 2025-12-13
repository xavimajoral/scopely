using SupportTicketingSystem.Domain;

namespace SupportTicketingSystem.Services;

/// <summary>
/// Service interface for ticket business logic
/// </summary>
public interface ITicketService
{
    Task<IEnumerable<Ticket>> GetUnresolvedTicketsAsync();

    Task<Ticket?> GetTicketByIdAsync(int id);

    Task<Ticket> CreateTicketAsync(string subject, string description, string username, string userId);

    Task<Ticket> ResolveTicketAsync(int ticketId);

    Task<Reply> AddReplyAsync(int ticketId, string message, string username, string userId, bool isFromAgent);
}

