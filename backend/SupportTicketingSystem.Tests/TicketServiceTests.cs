using Moq;
using SupportTicketingSystem.Data.Repositories;
using SupportTicketingSystem.Domain;
using SupportTicketingSystem.Services;
using Xunit;

namespace SupportTicketingSystem.Tests;

/// <summary>
/// Unit tests for TicketService business logic
/// </summary>
public class TicketServiceTests
{
    private readonly Mock<ITicketRepository> _ticketRepositoryMock;
    private readonly Mock<IReplyRepository> _replyRepositoryMock;
    private readonly TicketService _ticketService;

    public TicketServiceTests()
    {
        _ticketRepositoryMock = new Mock<ITicketRepository>();
        _replyRepositoryMock = new Mock<IReplyRepository>();
        _ticketService = new TicketService(_ticketRepositoryMock.Object, _replyRepositoryMock.Object);
    }

    [Fact]
    public async Task CreateTicketAsync_ShouldCreateTicketWithOpenStatus()
    {
        // Arrange
        var subject = "Test Subject";
        var description = "Test Description";
        var username = "John Doe";
        var userId = "123456";

        Ticket? createdTicket = null;
        _ticketRepositoryMock
            .Setup(r => r.CreateTicketAsync(It.IsAny<Ticket>()))
            .ReturnsAsync((Ticket t) =>
            {
                t.Id = 1;
                createdTicket = t;
                return t;
            });

        // Act
        var result = await _ticketService.CreateTicketAsync(subject, description, username, userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(subject, result.Subject);
        Assert.Equal(description, result.Description);
        Assert.Equal(username, result.Username);
        Assert.Equal(userId, result.UserId);
        Assert.Equal(TicketStatus.Open, result.Status);
        _ticketRepositoryMock.Verify(r => r.CreateTicketAsync(It.IsAny<Ticket>()), Times.Once);
    }

    [Fact]
    public async Task ResolveTicketAsync_ShouldUpdateStatusToResolved()
    {
        // Arrange
        var ticketId = 1;
        var ticket = new Ticket
        {
            Id = ticketId,
            Subject = "Test",
            Description = "Test",
            Username = "John Doe",
            UserId = "123456",
            Status = TicketStatus.InResolution,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _ticketRepositoryMock
            .Setup(r => r.GetTicketByIdAsync(ticketId))
            .ReturnsAsync(ticket);

        Ticket? updatedTicket = null;
        _ticketRepositoryMock
            .Setup(r => r.UpdateTicketAsync(It.IsAny<Ticket>()))
            .ReturnsAsync((Ticket t) =>
            {
                updatedTicket = t;
                return t;
            });

        // Act
        var result = await _ticketService.ResolveTicketAsync(ticketId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(TicketStatus.Resolved, result.Status);
        _ticketRepositoryMock.Verify(r => r.GetTicketByIdAsync(ticketId), Times.Once);
        _ticketRepositoryMock.Verify(r => r.UpdateTicketAsync(It.IsAny<Ticket>()), Times.Once);
    }

    [Fact]
    public async Task ResolveTicketAsync_ShouldThrowException_WhenTicketNotFound()
    {
        // Arrange
        var ticketId = 999;
        _ticketRepositoryMock
            .Setup(r => r.GetTicketByIdAsync(ticketId))
            .ReturnsAsync((Ticket?)null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _ticketService.ResolveTicketAsync(ticketId));
    }

    [Fact]
    public async Task AddReplyAsync_ShouldUpdateTicketStatusToInResolution_WhenAgentRepliesToOpenTicket()
    {
        // Arrange
        var ticketId = 1;
        var ticket = new Ticket
        {
            Id = ticketId,
            Subject = "Test",
            Description = "Test",
            Username = "John Doe",
            UserId = "123456",
            Status = TicketStatus.Open,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Replies = new List<Reply>()
        };

        _ticketRepositoryMock
            .Setup(r => r.GetTicketByIdAsync(ticketId))
            .ReturnsAsync(ticket);

        Ticket? updatedTicket = null;
        _ticketRepositoryMock
            .Setup(r => r.UpdateTicketAsync(It.IsAny<Ticket>()))
            .ReturnsAsync((Ticket t) =>
            {
                updatedTicket = t;
                return t;
            });

        Reply? createdReply = null;
        _replyRepositoryMock
            .Setup(r => r.CreateReplyAsync(It.IsAny<Reply>()))
            .ReturnsAsync((Reply reply) =>
            {
                reply.Id = 1;
                createdReply = reply;
                return reply;
            });

        // Act
        var result = await _ticketService.AddReplyAsync(
            ticketId,
            "Agent reply",
            "CS Agent",
            "agent123",
            isFromAgent: true
        );

        // Assert
        Assert.NotNull(result);
        Assert.True(result.IsFromAgent);
        Assert.Equal(TicketStatus.InResolution, updatedTicket?.Status);
        _ticketRepositoryMock.Verify(r => r.UpdateTicketAsync(It.IsAny<Ticket>()), Times.Once);
        _replyRepositoryMock.Verify(r => r.CreateReplyAsync(It.IsAny<Reply>()), Times.Once);
    }

    [Fact]
    public async Task AddReplyAsync_ShouldNotUpdateTicketStatus_WhenAgentRepliesToInResolutionTicket()
    {
        // Arrange
        var ticketId = 1;
        var ticket = new Ticket
        {
            Id = ticketId,
            Subject = "Test",
            Description = "Test",
            Username = "John Doe",
            UserId = "123456",
            Status = TicketStatus.InResolution,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Replies = new List<Reply>()
        };

        _ticketRepositoryMock
            .Setup(r => r.GetTicketByIdAsync(ticketId))
            .ReturnsAsync(ticket);

        Reply? createdReply = null;
        _replyRepositoryMock
            .Setup(r => r.CreateReplyAsync(It.IsAny<Reply>()))
            .ReturnsAsync((Reply reply) =>
            {
                reply.Id = 1;
                createdReply = reply;
                return reply;
            });

        // Act
        var result = await _ticketService.AddReplyAsync(
            ticketId,
            "Agent reply",
            "CS Agent",
            "agent123",
            isFromAgent: true
        );

        // Assert
        Assert.NotNull(result);
        // Status should remain InResolution, not be updated
        _ticketRepositoryMock.Verify(r => r.UpdateTicketAsync(It.IsAny<Ticket>()), Times.Never);
        _replyRepositoryMock.Verify(r => r.CreateReplyAsync(It.IsAny<Reply>()), Times.Once);
    }

    [Fact]
    public async Task AddReplyAsync_ShouldNotUpdateTicketStatus_WhenCustomerReplies()
    {
        // Arrange
        var ticketId = 1;
        var ticket = new Ticket
        {
            Id = ticketId,
            Subject = "Test",
            Description = "Test",
            Username = "John Doe",
            UserId = "123456",
            Status = TicketStatus.Open,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Replies = new List<Reply>()
        };

        _ticketRepositoryMock
            .Setup(r => r.GetTicketByIdAsync(ticketId))
            .ReturnsAsync(ticket);

        Reply? createdReply = null;
        _replyRepositoryMock
            .Setup(r => r.CreateReplyAsync(It.IsAny<Reply>()))
            .ReturnsAsync((Reply reply) =>
            {
                reply.Id = 1;
                createdReply = reply;
                return reply;
            });

        // Act
        var result = await _ticketService.AddReplyAsync(
            ticketId,
            "Customer reply",
            "John Doe",
            "123456",
            isFromAgent: false
        );

        // Assert
        Assert.NotNull(result);
        Assert.False(result.IsFromAgent);
        // Status should remain Open when customer replies
        _ticketRepositoryMock.Verify(r => r.UpdateTicketAsync(It.IsAny<Ticket>()), Times.Never);
        _replyRepositoryMock.Verify(r => r.CreateReplyAsync(It.IsAny<Reply>()), Times.Once);
    }

    [Fact]
    public async Task AddReplyAsync_ShouldThrowException_WhenTicketNotFound()
    {
        // Arrange
        var ticketId = 999;
        _ticketRepositoryMock
            .Setup(r => r.GetTicketByIdAsync(ticketId))
            .ReturnsAsync((Ticket?)null);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            _ticketService.AddReplyAsync(ticketId, "Message", "User", "123", false)
        );
    }
}

