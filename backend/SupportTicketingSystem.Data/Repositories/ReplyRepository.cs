using Microsoft.EntityFrameworkCore;
using SupportTicketingSystem.Domain;

namespace SupportTicketingSystem.Data.Repositories;

/// <summary>
/// Repository implementation for Reply operations
/// </summary>
public class ReplyRepository : IReplyRepository
{
    private readonly ApplicationDbContext _context;

    public ReplyRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Reply> CreateReplyAsync(Reply reply)
    {
        _context.Replies.Add(reply);
        await _context.SaveChangesAsync();
        return reply;
    }

    public async Task<IEnumerable<Reply>> GetRepliesByTicketIdAsync(int ticketId)
    {
        return await _context.Replies
            .Where(r => r.TicketId == ticketId)
            .OrderBy(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}

