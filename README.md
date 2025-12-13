# 🎫 Customer Support Ticketing System

> **A modern full-stack application for managing customer support tickets with real-time updates and seamless agent workflows**

A comprehensive ticketing system built with cutting-edge technologies, designed to streamline customer support operations. Support agents can efficiently view, respond to, and manage customer inquiries with an intuitive interface and automatic status management.

---

## ✨ Key Features

- **🎫 Ticket Management** - Create, view, and manage support tickets effortlessly
- **💬 Conversation Threads** - Chronological reply threads for each ticket
- **🔄 Smart Status Management** - Automatic status transitions based on agent interactions
  - Tickets start as **"Open"**
  - Automatically change to **"In Resolution"** when an agent replies
  - Can be manually marked as **"Resolved"**
- **⚡ Real-time Updates** - Automatic synchronization between backend and frontend every 30 seconds and on window focus
- **🏗️ Clean Architecture** - Separation of concerns with Repository and Service layers
- **🎨 Modern UI** - Beautiful, responsive interface built with React and CSS Modules
- **📏 Resizable Navigation** - Drag the navigation list's right edge to adjust width (persisted in localStorage)

---

## 🏗️ Architecture

### Backend Stack (.NET 8)

Built with clean architecture principles and modern .NET features:

- **📦 Domain Layer** - Core business entities (Ticket, Reply, TicketStatus)
- **💾 Data Layer** - Entity Framework Core with SQLite, Repository pattern
- **⚙️ Services Layer** - Business logic and ticket management
- **🌐 API Layer** - RESTful API controllers with DTOs

### Frontend Stack (React + TypeScript)

Modern React application with type safety and performance optimizations:

- **⚛️ React 19.2.3** - Latest React with cutting-edge features and security patches
- **📘 TypeScript** - Full type safety throughout
- **⚡ Vite 7** - Lightning-fast build tool and dev server
- **🎨 CSS Modules** - Scoped styling for maintainable components
- **🔄 React Compiler** - Automatic optimization and memoization
- **📡 React Query** - Efficient data fetching and caching

> 🔒 **Security Update**: React and React-DOM have been upgraded to version 19.2.3 to address security vulnerabilities discovered last week.

📖 **For detailed frontend documentation, see [Frontend README](./frontend/README.md)**

---

## 🚀 Quick Start

### Prerequisites

- **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** - [Install pnpm](https://pnpm.io/installation)
- **SQLite** - Included with .NET (no separate installation needed)

### 🎯 Getting Started

#### 1️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Restore NuGet packages
dotnet restore

# Build the solution
dotnet build

# Run the API
cd SupportTicketingSystem.Api
dotnet run
```

**Backend will be available at:**
- 🌐 API: `http://localhost:5000`
- 📚 Swagger UI: `http://localhost:5000/swagger`

#### 2️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

**Frontend will be available at:** `http://localhost:5173`

#### 3️⃣ Database

The SQLite database is **automatically created** on first run. The database file (`support_tickets.db`) will be created in the `SupportTicketingSystem.Api` directory.

> 💡 **Tip:** To reset the database, simply delete the `support_tickets.db` file and restart the API.

---

## 🎮 Running the Application

1. **Start Backend** (from `backend/SupportTicketingSystem.Api`):
   ```bash
   dotnet run
   ```

2. **Start Frontend** (from `frontend`):
   ```bash
   pnpm dev
   ```

3. **Open Browser**: Navigate to `http://localhost:5173`

---

## 🧪 Testing

### Backend Tests

Run all unit tests from the `backend` directory:

```bash
dotnet test
```

**Test Coverage:**
- ✅ Ticket creation
- ✅ Status updates
- ✅ Reply handling
- ✅ Status transition rules

---

## 📡 API Endpoints

### Tickets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tickets` | Get all unresolved tickets |
| `GET` | `/api/tickets/{id}` | Get a ticket by ID with replies |
| `POST` | `/api/tickets` | Create a new ticket |
| `POST` | `/api/tickets/{id}/resolve` | Mark a ticket as resolved |

### Replies

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tickets/{id}/replies` | Add a reply to a ticket |

---

## 📁 Project Structure

```
SupportTicketingSystem/
├── backend/
│   ├── SupportTicketingSystem.Domain/      # Domain models & entities
│   ├── SupportTicketingSystem.Data/        # EF Core, Repositories
│   ├── SupportTicketingSystem.Services/    # Business logic layer
│   ├── SupportTicketingSystem.Api/         # REST API & Controllers
│   └── SupportTicketingSystem.Tests/        # Unit tests
├── frontend/
│   ├── src/
│   │   ├── components/                     # React components
│   │   ├── hooks/                          # Custom React hooks
│   │   ├── services/                       # API service layer
│   │   └── types.ts                        # TypeScript definitions
│   └── package.json
└── README.md
```

---

## 🎯 Status Transitions

The system follows these status transition rules:

```
┌─────────┐
│  Open   │ ──────────────┐
└─────────┘               │
                          │ Agent replies
                          ▼
                  ┌──────────────────┐
                  │ In Resolution    │
                  └──────────────────┘
                          │
                          │ Manual resolve
                          ▼
                  ┌──────────────────┐
                  │   Resolved       │
                  └──────────────────┘
```

- **Open** → **In Resolution**: Automatic when agent replies
- **In Resolution** → **Resolved**: Manual action by agent
- Once resolved, tickets no longer appear in the unresolved tickets list

---

## ⚙️ Configuration & Assumptions

### Development Assumptions

1. **🔐 Authentication** - User authentication is handled externally. Username and User ID are provided as part of ticket/reply creation.

2. **👤 Agent Identification** - Frontend hardcodes agent info (`username: "CS Agent"`, `userId: "agent001"`). In production, this would come from authentication context.

3. **👥 Customer Information** - Customer username and User ID are provided when creating tickets. In production, this would come from a user management system.

4. **💾 Database** - SQLite is used for simplicity. Database is created automatically on first run.

5. **🌐 CORS** - Backend configured to allow requests from common frontend dev ports (3000, 5173, 4200). Adjust CORS settings in `Program.cs` for production.

---

## 🎨 Code Quality

- ✅ **Clean Code Principles** - Clear separation of concerns, single responsibility
- ✅ **Design Patterns** - Repository pattern, Service layer, Dependency Injection
- ✅ **Documentation** - Inline XML comments for public APIs
- ✅ **Testing** - Unit tests for core business logic with 100% coverage of status update rules
- ✅ **Type Safety** - Full TypeScript coverage in frontend
- ✅ **Code Formatting** - Prettier for consistent code style
- ✅ **Linting** - ESLint for code quality

---

## 🚀 Development Notes

- 🔄 **Backend-Frontend Sync** - Automatic synchronization every 30 seconds and on window focus
- 📦 API uses Entity Framework Core migrations (auto-created on first run)
- 🌐 CORS configured for development - update for production deployment
- 💾 SQLite database file is included in `.gitignore` by default
- ⚡ React Compiler enabled for automatic optimization
- 🔒 React 19.2.3 - Upgraded to address security vulnerabilities (January 2025)

---

## 🔮 Future Enhancements

Potential improvements for production:

- 🔐 User authentication and authorization
- 📡 Real-time updates using SignalR
- 📧 Email notifications
- 👥 Ticket assignment to specific agents
- ⚡ Priority levels and categories
- 🔍 Search and filtering capabilities
- 📎 File attachments
- 📊 Ticket history and audit logs
- 📈 Reporting and analytics
- 🏢 Multi-tenant support

---

## 📚 Documentation

- [Frontend README](./frontend/README.md) - Detailed frontend documentation
- [Deployment Guide](./DEPLOYMENT.md) - Complete guide for deploying and sharing the application
- [Remote Development Guide](./REMOTE_DEVELOPMENT.md) - Develop on iOS/mobile devices (GitHub Codespaces, Remote Desktop, etc.)
- [Backend API Documentation](http://localhost:5000/swagger) - Available when backend is running

---

## 📄 License

This project is created as a technical exercise.

---

**Built with ❤️ using .NET 8 and React 19**
