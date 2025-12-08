using System.ComponentModel.DataAnnotations;

namespace SupportTicketingSystem.Api.DTOs;

/// <summary>
/// DTO for creating a new reply
/// </summary>
public class CreateReplyDto
{
    [Required]
    public string Message { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string UserId { get; set; } = string.Empty;

    /// <summary>
    /// Indicates if this reply is from a support agent
    /// </summary>
    public bool IsFromAgent { get; set; } = true;
}

