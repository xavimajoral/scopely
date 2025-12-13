using System.ComponentModel.DataAnnotations;

namespace SupportTicketingSystem.Api.DTOs;

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

    public bool IsFromAgent { get; set; } = true;
}

