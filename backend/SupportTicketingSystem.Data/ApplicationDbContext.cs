using Microsoft.EntityFrameworkCore;
using SupportTicketingSystem.Domain;

namespace SupportTicketingSystem.Data;

/// <summary>
/// Application database context for Entity Framework Core
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    /// <summary>
    /// Tickets table
    /// </summary>
    public DbSet<Ticket> Tickets { get; set; }

    /// <summary>
    /// Replies table
    /// </summary>
    public DbSet<Reply> Replies { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Ticket entity
        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Subject).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();

            // Configure relationship with Replies
            entity.HasMany(e => e.Replies)
                  .WithOne(e => e.Ticket)
                  .HasForeignKey(e => e.TicketId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Reply entity
        modelBuilder.Entity<Reply>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Message).IsRequired();
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(50);
            entity.Property(e => e.IsFromAgent).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.TicketId).IsRequired();

            // Index for faster queries
            entity.HasIndex(e => e.TicketId);
            entity.HasIndex(e => e.CreatedAt);
        });
    }
}

