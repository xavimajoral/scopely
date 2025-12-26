using Microsoft.Extensions.Logging;
using SupportTicketingSystem.Data;
using SupportTicketingSystem.Data.Repositories;
using SupportTicketingSystem.Domain;
using SupportTicketingSystem.Domain.Exceptions;

namespace SupportTicketingSystem.Services;

/// <summary>
/// Service implementation for ticket business logic
/// </summary>
public class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IReplyRepository _replyRepository;
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<TicketService> _logger;

    public TicketService(
        ITicketRepository ticketRepository,
        IReplyRepository replyRepository,
        ApplicationDbContext dbContext,
        ILogger<TicketService> logger)
    {
        _ticketRepository = ticketRepository;
        _replyRepository = replyRepository;
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<IEnumerable<Ticket>> GetUnresolvedTicketsAsync()
    {
        _logger.LogDebug("Fetching unresolved tickets");
        var tickets = await _ticketRepository.GetUnresolvedTicketsAsync();
        _logger.LogDebug("Found {Count} unresolved tickets", tickets.Count());
        return tickets;
    }

    public async Task<Ticket?> GetTicketByIdAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException("ID must be greater than 0", nameof(id));
        }
        _logger.LogDebug("Fetching ticket with ID {TicketId}", id);
        return await _ticketRepository.GetTicketByIdAsync(id);
    }

    public async Task<Ticket> CreateTicketAsync(string subject, string description, string username, string userId)
    {
        if (string.IsNullOrWhiteSpace(subject))
        {
            throw new ArgumentException("Subject cannot be empty", nameof(subject));
        }
        if (string.IsNullOrWhiteSpace(description))
        {
            throw new ArgumentException("Description cannot be empty", nameof(description));
        }
        if (string.IsNullOrWhiteSpace(username))
        {
            throw new ArgumentException("Username cannot be empty", nameof(username));
        }
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("User ID cannot be empty", nameof(userId));
        }

        _logger.LogInformation("Creating ticket with subject '{Subject}' for user {Username} ({UserId})", subject, username, userId);

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

        var createdTicket = await _ticketRepository.CreateTicketAsync(ticket);
        _logger.LogInformation("Ticket {TicketId} created successfully", createdTicket.Id);
        return createdTicket;
    }

    public async Task<Ticket> ResolveTicketAsync(int ticketId)
    {
        if (ticketId <= 0)
        {
            throw new ArgumentException("Ticket ID must be greater than 0", nameof(ticketId));
        }

        _logger.LogInformation("Resolving ticket {TicketId}", ticketId);

        var ticket = await _ticketRepository.GetTicketByIdAsync(ticketId);
        if (ticket == null)
        {
            _logger.LogWarning("Attempted to resolve non-existent ticket {TicketId}", ticketId);
            throw new TicketNotFoundException(ticketId);
        }

        ticket.Status = TicketStatus.Resolved;
        ticket.UpdatedAt = DateTime.UtcNow;

        var resolvedTicket = await _ticketRepository.UpdateTicketAsync(ticket);
        _logger.LogInformation("Ticket {TicketId} resolved successfully", ticketId);
        return resolvedTicket;
    }

    public async Task<Reply> AddReplyAsync(int ticketId, string message, string username, string userId, bool isFromAgent)
    {
        if (ticketId <= 0)
        {
            throw new ArgumentException("Ticket ID must be greater than 0", nameof(ticketId));
        }
        if (string.IsNullOrWhiteSpace(message))
        {
            throw new ArgumentException("Message cannot be empty", nameof(message));
        }
        if (string.IsNullOrWhiteSpace(username))
        {
            throw new ArgumentException("Username cannot be empty", nameof(username));
        }
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("User ID cannot be empty", nameof(userId));
        }

        _logger.LogInformation("Adding reply to ticket {TicketId} from {Username} (isAgent: {IsFromAgent})", ticketId, username, isFromAgent);

        var ticket = await _ticketRepository.GetTicketByIdAsync(ticketId);
        if (ticket == null)
        {
            _logger.LogWarning("Attempted to add reply to non-existent ticket {TicketId}", ticketId);
            throw new TicketNotFoundException(ticketId);
        }

        // Use transaction for multi-step operation (status update + reply creation)
        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            // Business rule: If an agent replies, update ticket status to InResolution
            if (isFromAgent && ticket.Status == TicketStatus.Open)
            {
                _logger.LogInformation("Updating ticket {TicketId} status from Open to InResolution", ticketId);
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

            var createdReply = await _replyRepository.CreateReplyAsync(reply);

            await transaction.CommitAsync();
            _logger.LogInformation("Reply {ReplyId} added to ticket {TicketId}", createdReply.Id, ticketId);
            return createdReply;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Failed to add reply to ticket {TicketId}, transaction rolled back", ticketId);
            throw;
        }
    }
}

