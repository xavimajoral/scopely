# Customer Support Ticketing System

A full-stack web application for managing customer support tickets, built with .NET 8 backend and React TypeScript frontend.

## Project Overview

This application provides a comprehensive ticketing system for customer support operations. Support agents can view unresolved tickets, respond to customer inquiries, and manage ticket statuses. The system automatically updates ticket statuses based on agent interactions.

### Key Features

- **Ticket Management**: Create, view, and manage support tickets
- **Reply Thread**: Chronological conversation thread for each ticket
- **Status Management**: 
  - Tickets start as "Open"
  - Automatically change to "In Resolution" when an agent replies
  - Can be manually marked as "Resolved"
- **Real-time Updates**: Frontend automatically refreshes ticket list
- **Clean Architecture**: Separation of concerns with Repository and Service layers

## Architecture

### Backend (.NET 8)

The backend follows clean architecture principles with the following layers:

- **Domain**: Core business entities (Ticket, Reply, TicketStatus)
- **Data**: Entity Framework Core with SQLite, Repository pattern implementation
- **Services**: Business logic layer (TicketService)
- **Api**: RESTful API controllers with DTOs

### Frontend (React + TypeScript)

- **Components**: Modular React components for UI
- **Services**: API service layer for backend communication
- **State Management**: React hooks for local state management
- **TypeScript**: Full type safety throughout the application

## Prerequisites

- .NET 8 SDK
- Node.js 16+ and npm
- SQLite (included with .NET)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

3. Build the solution:
   ```bash
   dotnet build
   ```

4. Run the API:
   ```bash
   cd SupportTicketingSystem.Api
   dotnet run
   ```

   The API will be available at:
   - HTTP: `http://localhost:5000`
   - Swagger UI: `http://localhost:5000/swagger`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

### Database Setup

The SQLite database is automatically created on first run. The database file (`support_tickets.db`) will be created in the `SupportTicketingSystem.Api` directory.

To reset the database, simply delete the `support_tickets.db` file and restart the API.

## Running the Application

1. Start the backend API (from `backend/SupportTicketingSystem.Api`):
   ```bash
   dotnet run
   ```

2. Start the frontend (from `frontend`):
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Running Tests

### Backend Tests

From the `backend` directory:

```bash
dotnet test
```

This will run all unit tests for the business logic, including:
- Ticket creation
- Status updates
- Reply handling
- Status transition rules

## API Endpoints

### Tickets

- `GET /api/tickets` - Get all unresolved tickets
- `GET /api/tickets/{id}` - Get a ticket by ID with replies
- `POST /api/tickets` - Create a new ticket
- `POST /api/tickets/{id}/resolve` - Mark a ticket as resolved

### Replies

- `POST /api/tickets/{id}/replies` - Add a reply to a ticket

## Assumptions

1. **User Authentication**: The system assumes user authentication is handled externally. Username and User ID are provided as part of ticket/reply creation.

2. **Agent Identification**: The frontend hardcodes agent information (username: "CS Agent", userId: "agent001"). In a production system, this would come from authentication context.

3. **Customer Information**: Customer username and User ID are provided when creating tickets. In production, this would typically come from a user management system.

4. **Database**: SQLite is used for simplicity. The database is created automatically on first run.

5. **CORS**: The backend is configured to allow requests from common frontend development ports (3000, 5173, 4200). Adjust CORS settings in `Program.cs` for production.

6. **Status Transitions**: 
   - Tickets start as "Open"
   - When an agent replies to an "Open" ticket, it automatically becomes "In Resolution"
   - Tickets can only be manually marked as "Resolved"
   - Once resolved, tickets no longer appear in the unresolved tickets list

## Project Structure

```
SupportTicketingSystem/
├── backend/
│   ├── SupportTicketingSystem.Domain/      # Domain models
│   ├── SupportTicketingSystem.Data/        # EF Core, Repositories
│   ├── SupportTicketingSystem.Services/    # Business logic
│   ├── SupportTicketingSystem.Api/         # REST API
│   └── SupportTicketingSystem.Tests/        # Unit tests
├── frontend/
│   ├── src/
│   │   ├── components/                     # React components
│   │   ├── services/                       # API service
│   │   └── types.ts                        # TypeScript types
│   └── package.json
└── README.md
```

## Code Quality

- **Clean Code Principles**: Clear separation of concerns, single responsibility
- **Design Patterns**: Repository pattern, Service layer, Dependency Injection
- **Documentation**: Inline XML comments for public APIs
- **Testing**: Unit tests for core business logic with 100% coverage of status update rules
- **Type Safety**: Full TypeScript coverage in frontend

## Development Notes

- The frontend automatically refreshes the ticket list every 30 seconds
- The API uses Entity Framework Core migrations (auto-created on first run)
- CORS is configured for development. Update for production deployment
- The SQLite database file is included in `.gitignore` by default

## Future Enhancements

Potential improvements for production:

1. User authentication and authorization
2. Real-time updates using SignalR
3. Email notifications
4. Ticket assignment to specific agents
5. Priority levels and categories
6. Search and filtering capabilities
7. File attachments
8. Ticket history and audit logs
9. Reporting and analytics
10. Multi-tenant support

## License

This project is created as a technical exercise.

