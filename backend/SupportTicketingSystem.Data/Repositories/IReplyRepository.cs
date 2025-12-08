using SupportTicketingSystem.Domain;

namespace SupportTicketingSystem.Data.Repositories;

/// <summary>
/// Repository interface for Reply operations
/// </summary>
public interface IReplyRepository
{
    /// <summary>
    /// Create a new reply
    /// </summary>
    Task<Reply> CreateReplyAsync(Reply reply);

    /// <summary>
    /// Get all replies for a ticket
    /// </summary>
    Task<IEnumerable<Reply>> GetRepliesByTicketIdAsync(int ticketId);

    /// <summary>
    /// Save changes to the database
    /// </summary>
    Task<int> SaveChangesAsync();
}

