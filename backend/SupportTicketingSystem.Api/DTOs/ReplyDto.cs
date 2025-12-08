namespace SupportTicketingSystem.Api.DTOs;

/// <summary>
/// DTO for reply response
/// </summary>
public class ReplyDto
{
    public int Id { get; set; }
    public int TicketId { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public bool IsFromAgent { get; set; }
    public DateTime CreatedAt { get; set; }
}

