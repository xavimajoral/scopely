namespace SupportTicketingSystem.Domain.Exceptions;

/// <summary>
/// Exception thrown when a ticket is not found
/// </summary>
public class TicketNotFoundException : Exception
{
    public int TicketId { get; }

    public TicketNotFoundException(int ticketId)
        : base($"Ticket with ID {ticketId} not found")
    {
        TicketId = ticketId;
    }

    public TicketNotFoundException(int ticketId, string message)
        : base(message)
    {
        TicketId = ticketId;
    }

    public TicketNotFoundException(int ticketId, string message, Exception innerException)
        : base(message, innerException)
    {
        TicketId = ticketId;
    }
}
