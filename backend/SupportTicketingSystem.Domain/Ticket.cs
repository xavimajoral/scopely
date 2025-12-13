namespace SupportTicketingSystem.Domain;

/// <summary>
/// Represents a customer support ticket
/// </summary>
public class Ticket
{
    public int Id { get; set; }

    public string Subject { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

    public TicketStatus Status { get; set; } = TicketStatus.Open;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Reply> Replies { get; set; } = new List<Reply>();
}

