# 🚀 Deployment & Sharing Guide

This guide covers multiple ways to share and deploy your Customer Support Ticketing System.

---

## 📦 Recommended Approach: Multi-Platform Strategy

For a full-stack application like this, we recommend using **multiple platforms** for different purposes:

1. **GitHub** - Source control and collaboration (essential)
2. **Docker Compose** - Local development and easy setup
3. **Vercel/Netlify** - Frontend deployment (free tier, excellent DX)
4. **Railway/Render** - Full-stack deployment (backend + database)

---

## 1️⃣ GitHub (Source Control)

### Why GitHub?
- ✅ Industry standard for version control
- ✅ Free public/private repositories
- ✅ Easy collaboration
- ✅ GitHub Actions for CI/CD
- ✅ Issue tracking and project management

### Setup

```bash
# Initialize git (if not already done)
git init

# Add remote
git remote add origin https://github.com/yourusername/support-ticketing-system.git

# Push to GitHub
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Recommended .gitignore

Ensure your `.gitignore` includes:
- `node_modules/`
- `bin/`, `obj/` (backend build artifacts)
- `*.db`, `*.db-shm`, `*.db-wal` (SQLite files)
- `.env` files
- `dist/`, `build/` (build outputs)

---

## 2️⃣ Docker & Docker Compose (Recommended for Sharing)

### Why Docker?
- ✅ **One-command setup** - Anyone can run your app with `docker-compose up`
- ✅ **Consistent environment** - Works the same everywhere
- ✅ **Easy sharing** - Share the entire stack easily
- ✅ **Production-like** - Test in production-like environment

### Setup Docker

#### Create `Dockerfile` for Backend

Create `backend/Dockerfile`:

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["SupportTicketingSystem.Api/SupportTicketingSystem.Api.csproj", "SupportTicketingSystem.Api/"]
COPY ["SupportTicketingSystem.Data/SupportTicketingSystem.Data.csproj", "SupportTicketingSystem.Data/"]
COPY ["SupportTicketingSystem.Domain/SupportTicketingSystem.Domain.csproj", "SupportTicketingSystem.Domain/"]
COPY ["SupportTicketingSystem.Services/SupportTicketingSystem.Services.csproj", "SupportTicketingSystem.Services/"]

RUN dotnet restore "SupportTicketingSystem.Api/SupportTicketingSystem.Api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/SupportTicketingSystem.Api"
RUN dotnet build "SupportTicketingSystem.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SupportTicketingSystem.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SupportTicketingSystem.Api.dll"]
```

#### Create `Dockerfile` for Frontend

Create `frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Create `nginx.conf` for Frontend

Create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if needed)
    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Create `docker-compose.yml` (Root)

Create `docker-compose.yml` in the root:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_URLS=http://+:5000
      - ASPNETCORE_ENVIRONMENT=Production
    volumes:
      - ./backend/SupportTicketingSystem.Api:/app/data
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:5000/api
    restart: unless-stopped
```

### Usage

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up --build
```

**Access:**
- Frontend: http://localhost
- Backend API: http://localhost:5000
- Swagger: http://localhost:5000/swagger

---

## 3️⃣ Vercel (Frontend Deployment)

### Why Vercel?
- ✅ **Free tier** - Perfect for demos and portfolios
- ✅ **Zero config** - Automatic deployments from GitHub
- ✅ **Fast CDN** - Global edge network
- ✅ **Preview deployments** - Test PRs before merging
- ✅ **Excellent DX** - Great developer experience

### Setup

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Create `vercel.json`** in `frontend/`:
   ```json
   {
     "buildCommand": "cd frontend && pnpm install && pnpm build",
     "outputDirectory": "frontend/dist",
     "devCommand": "cd frontend && pnpm dev",
     "installCommand": "cd frontend && pnpm install",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ],
     "env": {
       "VITE_API_URL": "https://your-backend-url.com/api"
     }
   }
   ```

3. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

4. **Connect to GitHub** (recommended):
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable: `VITE_API_URL`

### Alternative: Netlify

Similar to Vercel, create `frontend/netlify.toml`:

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 4️⃣ Railway / Render (Full-Stack Deployment)

### Why Railway/Render?
- ✅ **Full-stack support** - Deploy backend + frontend together
- ✅ **Database included** - PostgreSQL/MySQL support
- ✅ **Free tier available** - Good for demos
- ✅ **Auto-deploy from GitHub** - CI/CD built-in

### Railway Setup

1. **Install Railway CLI**:
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Create `railway.json`** (root):
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "dotnet run --project SupportTicketingSystem.Api/SupportTicketingSystem.Api.csproj",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

3. **Deploy**:
   ```bash
   railway init
   railway up
   ```

### Render Setup

1. **Create `render.yaml`** (root):
   ```yaml
   services:
     - type: web
       name: backend
       env: dotnet
       buildCommand: cd backend && dotnet restore && dotnet publish -c Release
       startCommand: cd backend/SupportTicketingSystem.Api && dotnet SupportTicketingSystem.Api.dll
       envVars:
         - key: ASPNETCORE_ENVIRONMENT
           value: Production
         - key: ASPNETCORE_URLS
           value: http://0.0.0.0:5000

     - type: web
       name: frontend
       env: node
       buildCommand: cd frontend && pnpm install && pnpm build
       staticPublishPath: ./frontend/dist
       envVars:
         - key: VITE_API_URL
           value: https://your-backend-url.onrender.com/api
   ```

2. **Deploy via Render Dashboard**:
   - Connect GitHub repository
   - Create new Web Service
   - Select backend or frontend
   - Configure build/start commands

---

## 5️⃣ Comparison Matrix

| Platform | Best For | Cost | Setup Complexity | Full-Stack |
|----------|----------|------|------------------|------------|
| **GitHub** | Source control | Free | ⭐ Easy | ❌ |
| **Docker** | Local dev, sharing | Free | ⭐⭐ Medium | ✅ |
| **Vercel** | Frontend only | Free tier | ⭐ Easy | ❌ |
| **Netlify** | Frontend only | Free tier | ⭐ Easy | ❌ |
| **Railway** | Full-stack | Free tier | ⭐⭐ Medium | ✅ |
| **Render** | Full-stack | Free tier | ⭐⭐ Medium | ✅ |
| **AWS/GCP** | Production | Paid | ⭐⭐⭐ Complex | ✅ |

---

## 🎯 Recommended Workflow

### For Sharing/Demo:
1. **GitHub** - Host source code
2. **Docker Compose** - Easy local setup (one command)
3. **Vercel** - Deploy frontend (free, fast)
4. **Railway/Render** - Deploy backend (free tier)

### For Production:
1. **GitHub** - Source control + CI/CD
2. **Docker** - Containerize both services
3. **Cloud Provider** (AWS/GCP/Azure) - Production hosting
4. **PostgreSQL** - Replace SQLite with production database

---

## 📝 Quick Start Commands

### Docker (Recommended for Sharing)
```bash
# Clone repo
git clone https://github.com/yourusername/support-ticketing-system.git
cd support-ticketing-system

# Run everything
docker-compose up --build

# Access at http://localhost
```

### Manual Setup (Development)
```bash
# Backend
cd backend/SupportTicketingSystem.Api
dotnet run

# Frontend (new terminal)
cd frontend
pnpm install
pnpm dev
```

---

## 🔐 Environment Variables

### Backend
- `ASPNETCORE_ENVIRONMENT` - `Development` or `Production`
- `ASPNETCORE_URLS` - Server URLs (default: `http://+:5000`)

### Frontend
- `VITE_API_URL` - Backend API URL (default: `http://localhost:5000/api`)

---

## 🚀 Next Steps

1. **Choose your deployment strategy** based on your needs
2. **Set up GitHub repository** for source control
3. **Create Docker setup** for easy sharing
4. **Deploy frontend** to Vercel/Netlify
5. **Deploy backend** to Railway/Render
6. **Update README** with deployment links

---

**Need help?** Check the individual platform documentation or open an issue on GitHub!

---

## 📱 Mobile/iOS Development

Want to develop on iOS or mobile devices? See [REMOTE_DEVELOPMENT.md](./REMOTE_DEVELOPMENT.md) for:
- GitHub Codespaces setup (VS Code in browser)
- Remote desktop solutions
- Cloud-based IDEs
- SSH terminal access

Perfect for coding on iPad or iPhone! 🎉

