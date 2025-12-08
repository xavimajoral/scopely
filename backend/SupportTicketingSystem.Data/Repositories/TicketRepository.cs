using Microsoft.EntityFrameworkCore;
using SupportTicketingSystem.Domain;

namespace SupportTicketingSystem.Data.Repositories;

/// <summary>
/// Repository implementation for Ticket operations
/// </summary>
public class TicketRepository : ITicketRepository
{
    private readonly ApplicationDbContext _context;

    public TicketRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Ticket>> GetUnresolvedTicketsAsync()
    {
        return await _context.Tickets
            .Where(t => t.Status != TicketStatus.Resolved)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<Ticket?> GetTicketByIdAsync(int id)
    {
        return await _context.Tickets
            .Include(t => t.Replies.OrderBy(r => r.CreatedAt))
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Ticket> CreateTicketAsync(Ticket ticket)
    {
        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();
        return ticket;
    }

    public async Task<Ticket> UpdateTicketAsync(Ticket ticket)
    {
        ticket.UpdatedAt = DateTime.UtcNow;
        _context.Tickets.Update(ticket);
        await _context.SaveChangesAsync();
        return ticket;
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}

