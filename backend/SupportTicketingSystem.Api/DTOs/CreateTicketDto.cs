using System.ComponentModel.DataAnnotations;

namespace SupportTicketingSystem.Api.DTOs;

/// <summary>
/// DTO for creating a new ticket
/// </summary>
public class CreateTicketDto
{
    [Required]
    [StringLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string UserId { get; set; } = string.Empty;
}

