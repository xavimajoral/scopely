using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using SupportTicketingSystem.Data;
using SupportTicketingSystem.Data.Repositories;
using SupportTicketingSystem.Services;

// Custom naming policy for UPPER_SNAKE_CASE enum serialization

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter(namingPolicy: new UpperSnakeCaseNamingPolicy()));
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS for frontend
var allowedOrigins = new List<string>
{
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:4200"
};

// Add Render frontend URL if provided via environment variable
var renderFrontendUrl = Environment.GetEnvironmentVariable("RENDER_FRONTEND_URL");
if (!string.IsNullOrEmpty(renderFrontendUrl))
{
    allowedOrigins.Add(renderFrontendUrl);
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins.ToArray())
              .AllowAnyMethod()
              .WithHeaders("Content-Type", "Authorization")
              .AllowCredentials();
    });
});

// Configure SQLite database
// On Render, use persistent disk path if available, otherwise use content root
var persistentDiskPath = Environment.GetEnvironmentVariable("RENDER_DISK_PATH");
var dbPath = !string.IsNullOrEmpty(persistentDiskPath)
    ? Path.Combine(persistentDiskPath, "support_tickets.db")
    : Path.Combine(builder.Environment.ContentRootPath, "support_tickets.db");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// Register repositories
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<IReplyRepository, ReplyRepository>();

// Register services
builder.Services.AddScoped<ITicketService, TicketService>();

// Configure port for Render (Render sets PORT environment variable)
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

var app = builder.Build();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

// Enable CORS
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();

// Custom naming policy for UPPER_SNAKE_CASE enum serialization
public class UpperSnakeCaseNamingPolicy : JsonNamingPolicy
{
    public override string ConvertName(string name)
    {
        // Convert PascalCase to UPPER_SNAKE_CASE
        var result = Regex.Replace(name, "(?<!^)([A-Z])", "_$1");
        return result.ToUpperInvariant();
    }
}
