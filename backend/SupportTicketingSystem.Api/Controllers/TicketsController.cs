using Microsoft.AspNetCore.Mvc;
using SupportTicketingSystem.Api.DTOs;
using SupportTicketingSystem.Domain;
using SupportTicketingSystem.Services;

namespace SupportTicketingSystem.Api.Controllers;

/// <summary>
/// Controller for managing support tickets
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;
    private readonly ILogger<TicketsController> _logger;

    public TicketsController(ITicketService ticketService, ILogger<TicketsController> logger)
    {
        _ticketService = ticketService;
        _logger = logger;
    }

    /// <summary>
    /// Get all unresolved tickets
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TicketDto>>> GetUnresolvedTickets()
    {
        try
        {
            var tickets = await _ticketService.GetUnresolvedTicketsAsync();
            var ticketDtos = tickets.Select(MapToDto).ToList();
            return Ok(ticketDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting unresolved tickets");
            return StatusCode(500, "An error occurred while retrieving tickets");
        }
    }

    /// <summary>
    /// Get a ticket by ID with its replies
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TicketDto>> GetTicket(int id)
    {
        try
        {
            var ticket = await _ticketService.GetTicketByIdAsync(id);
            if (ticket == null)
            {
                return NotFound($"Ticket with ID {id} not found");
            }

            return Ok(MapToDto(ticket));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting ticket {TicketId}", id);
            return StatusCode(500, "An error occurred while retrieving the ticket");
        }
    }

    /// <summary>
    /// Create a new ticket
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TicketDto>> CreateTicket([FromBody] CreateTicketDto dto)
    {
        try
        {
            var ticket = await _ticketService.CreateTicketAsync(
                dto.Subject,
                dto.Description,
                dto.Username,
                dto.UserId
            );

            return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, MapToDto(ticket));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating ticket");
            return StatusCode(500, "An error occurred while creating the ticket");
        }
    }

    /// <summary>
    /// Mark a ticket as resolved
    /// </summary>
    [HttpPost("{id}/resolve")]
    public async Task<ActionResult<TicketDto>> ResolveTicket(int id)
    {
        try
        {
            var ticket = await _ticketService.ResolveTicketAsync(id);
            return Ok(MapToDto(ticket));
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resolving ticket {TicketId}", id);
            return StatusCode(500, "An error occurred while resolving the ticket");
        }
    }

    /// <summary>
    /// Add a reply to a ticket
    /// </summary>
    [HttpPost("{id}/replies")]
    public async Task<ActionResult<ReplyDto>> AddReply(int id, [FromBody] CreateReplyDto dto)
    {
        try
        {
            var reply = await _ticketService.AddReplyAsync(
                id,
                dto.Message,
                dto.Username,
                dto.UserId,
                dto.IsFromAgent
            );

            return CreatedAtAction(
                nameof(GetTicket),
                new { id = reply.TicketId },
                MapToDto(reply)
            );
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding reply to ticket {TicketId}", id);
            return StatusCode(500, "An error occurred while adding the reply");
        }
    }

    private static TicketDto MapToDto(Ticket ticket)
    {
        return new TicketDto
        {
            Id = ticket.Id,
            Subject = ticket.Subject,
            Description = ticket.Description,
            Username = ticket.Username,
            UserId = ticket.UserId,
            Status = ticket.Status,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt,
            Replies = ticket.Replies.Select(MapToDto).ToList()
        };
    }

    private static ReplyDto MapToDto(Reply reply)
    {
        return new ReplyDto
        {
            Id = reply.Id,
            TicketId = reply.TicketId,
            Message = reply.Message,
            Username = reply.Username,
            UserId = reply.UserId,
            IsFromAgent = reply.IsFromAgent,
            CreatedAt = reply.CreatedAt
        };
    }
}

