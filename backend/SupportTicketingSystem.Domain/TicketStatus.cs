namespace SupportTicketingSystem.Domain;

/// <summary>
/// Represents the status of a support ticket
/// </summary>
public enum TicketStatus
{
    /// <summary>
    /// Ticket is newly created and awaiting agent response
    /// </summary>
    Open = 0,
    
    /// <summary>
    /// An agent has replied, ticket is being worked on
    /// </summary>
    InResolution = 1,
    
    /// <summary>
    /// Ticket has been manually marked as resolved by an agent
    /// </summary>
    Resolved = 2
}

