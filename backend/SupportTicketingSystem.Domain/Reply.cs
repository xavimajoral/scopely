namespace SupportTicketingSystem.Domain;

public class Reply
{
    /// <summary>
    /// Unique identifier for the reply
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// The ticket this reply belongs to
    /// </summary>
    public int TicketId { get; set; }
    
    /// <summary>
    /// Navigation property to the ticket
    /// </summary>
    public Ticket Ticket { get; set; } = null!;
    
    /// <summary>
    /// Content/message of the reply
    /// </summary>
    public string Message { get; set; } = string.Empty;
    
    /// <summary>
    /// Username of the person who created the reply
    /// </summary>
    public string Username { get; set; } = string.Empty;
    
    /// <summary>
    /// User ID of the person who created the reply
    /// </summary>
    public string UserId { get; set; } = string.Empty;
    
    /// <summary>
    /// Indicates if this reply is from a support agent
    /// </summary>
    public bool IsFromAgent { get; set; }
    
    /// <summary>
    /// Timestamp when the reply was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

