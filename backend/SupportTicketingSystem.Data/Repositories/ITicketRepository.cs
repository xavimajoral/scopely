using SupportTicketingSystem.Domain;

namespace SupportTicketingSystem.Data.Repositories;

public interface ITicketRepository
{
    Task<IEnumerable<Ticket>> GetUnresolvedTicketsAsync();

    Task<Ticket?> GetTicketByIdAsync(int id);

    Task<Ticket> CreateTicketAsync(Ticket ticket);

    Task<Ticket> UpdateTicketAsync(Ticket ticket);

    Task<int> SaveChangesAsync();
}

