using SupportTicketingSystem.Data.Repositories;
using SupportTicketingSystem.Domain;

namespace SupportTicketingSystem.Services;

/// <summary>
/// Service implementation for ticket business logic
/// </summary>
public class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IReplyRepository _replyRepository;

    public TicketService(ITicketRepository ticketRepository, IReplyRepository replyRepository)
    {
        _ticketRepository = ticketRepository;
        _replyRepository = replyRepository;
    }

    public async Task<IEnumerable<Ticket>> GetUnresolvedTicketsAsync()
    {
        return await _ticketRepository.GetUnresolvedTicketsAsync();
    }

    public async Task<Ticket?> GetTicketByIdAsync(int id)
    {
        return await _ticketRepository.GetTicketByIdAsync(id);
    }

    public async Task<Ticket> CreateTicketAsync(string subject, string description, string username, string userId)
    {
        var ticket = new Ticket
        {
            Subject = subject,
            Description = description,
            Username = username,
            UserId = userId,
            Status = TicketStatus.Open,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        return await _ticketRepository.CreateTicketAsync(ticket);
    }

    public async Task<Ticket> ResolveTicketAsync(int ticketId)
    {
        var ticket = await _ticketRepository.GetTicketByIdAsync(ticketId);
        if (ticket == null)
        {
            throw new ArgumentException($"Ticket with ID {ticketId} not found", nameof(ticketId));
        }

        ticket.Status = TicketStatus.Resolved;
        ticket.UpdatedAt = DateTime.UtcNow;

        return await _ticketRepository.UpdateTicketAsync(ticket);
    }

    public async Task<Reply> AddReplyAsync(int ticketId, string message, string username, string userId, bool isFromAgent)
    {
        var ticket = await _ticketRepository.GetTicketByIdAsync(ticketId);
        if (ticket == null)
        {
            throw new ArgumentException($"Ticket with ID {ticketId} not found", nameof(ticketId));
        }

        // Business rule: If an agent replies, update ticket status to InResolution
        if (isFromAgent && ticket.Status == TicketStatus.Open)
        {
            ticket.Status = TicketStatus.InResolution;
            ticket.UpdatedAt = DateTime.UtcNow;
            await _ticketRepository.UpdateTicketAsync(ticket);
        }

        var reply = new Reply
        {
            TicketId = ticketId,
            Message = message,
            Username = username,
            UserId = userId,
            IsFromAgent = isFromAgent,
            CreatedAt = DateTime.UtcNow
        };

        return await _replyRepository.CreateReplyAsync(reply);
    }
}

