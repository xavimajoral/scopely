using SupportTicketingSystem.Domain;

namespace SupportTicketingSystem.Api.DTOs;

/// <summary>
/// DTO for ticket response
/// </summary>
public class TicketDto
{
    public int Id { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public TicketStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<ReplyDto> Replies { get; set; } = new();
}

