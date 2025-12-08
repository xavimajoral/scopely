namespace SupportTicketingSystem.Domain;

/// <summary>
/// Represents a customer support ticket
/// </summary>
public class Ticket
{
    /// <summary>
    /// Unique identifier for the ticket
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Subject/title of the ticket
    /// </summary>
    public string Subject { get; set; } = string.Empty;
    
    /// <summary>
    /// Initial description/body of the ticket
    /// </summary>
    public string Description { get; set; } = string.Empty;
    
    /// <summary>
    /// Username of the customer who created the ticket
    /// </summary>
    public string Username { get; set; } = string.Empty;
    
    /// <summary>
    /// User ID of the customer who created the ticket
    /// </summary>
    public string UserId { get; set; } = string.Empty;
    
    /// <summary>
    /// Current status of the ticket
    /// </summary>
    public TicketStatus Status { get; set; } = TicketStatus.Open;
    
    /// <summary>
    /// Timestamp when the ticket was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Timestamp when the ticket was last updated
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Collection of replies to this ticket
    /// </summary>
    public ICollection<Reply> Replies { get; set; } = new List<Reply>();
}

