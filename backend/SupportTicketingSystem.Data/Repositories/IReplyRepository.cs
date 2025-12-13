using SupportTicketingSystem.Domain;

namespace SupportTicketingSystem.Data.Repositories;

public interface IReplyRepository
{

    Task<Reply> CreateReplyAsync(Reply reply);

    Task<IEnumerable<Reply>> GetRepliesByTicketIdAsync(int ticketId);

    Task<int> SaveChangesAsync();
}

