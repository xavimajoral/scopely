# 🚀 Render Deployment Guide

Complete step-by-step guide to deploy your fullstack application on Render.

---

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com) (free tier available)
3. **Repository Access** - Make sure your repository is accessible (public or Render has access)

---

## 🎯 Quick Start (Using render.yaml)

The easiest way to deploy is using the `render.yaml` file included in this repository.

### Step 1: Push to GitHub

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Connect Repository to Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select the repository containing this project
5. Render will automatically detect `render.yaml`
6. Click **"Apply"**

### Step 3: Configure Services

Render will create two services:
- **Backend** (Web Service) - Your .NET API
- **Frontend** (Static Site) - Your React app

The `render.yaml` file is pre-configured. **Note:** On the free tier, persistent disks are not available, so the SQLite database will reset on each deployment. For production, consider upgrading to a paid plan or migrating to PostgreSQL.

### Step 4: Update Frontend API URL

After the backend is deployed:

1. Go to your **Frontend** service in Render dashboard
2. Go to **Environment** tab
3. Update `VITE_API_URL` to:
   ```
   https://your-backend-service.onrender.com/api
   ```
4. Click **"Save Changes"**
5. Render will automatically rebuild the frontend

---

## 🔧 Manual Setup (Step-by-Step)

If you prefer to set up services manually:

### 1️⃣ Deploy Backend

#### Create Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings:**
   - **Name**: `support-ticketing-backend`
   - **Region**: Choose closest region (e.g., `Oregon`)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Environment**: `Dotnet`
   - **Plan**: `Free` (or choose paid plan)

   **Build & Deploy:**
   - **Build Command**: 
     ```bash
     dotnet restore && dotnet publish -c Release -o ./publish
     ```
   - **Start Command**: 
     ```bash
     cd publish && dotnet SupportTicketingSystem.Api.dll
     ```

   **Environment Variables:**
   - `ASPNETCORE_ENVIRONMENT` = `Production`
   - `ASPNETCORE_URLS` = `http://0.0.0.0:10000`
   - `PORT` = `10000`

5. Click **"Create Web Service"**

#### Persistent Disk (Not Available on Free Tier)

⚠️ **Important**: 
- **Free Tier**: Persistent disks are **not available** on the free tier. The SQLite database will reset on each deployment.
- **Paid Plans**: If you upgrade to a paid plan, you can add a persistent disk:
  1. Go to your backend service
  2. Click **"Disks"** tab
  3. Click **"Link Persistent Disk"**
  4. Configure the disk and mount path

#### Database Path (Free Tier)

Update `Program.cs` to use the persistent disk path:

```csharp
// In Program.cs, update the database path:
var dbPath = Environment.GetEnvironmentVariable("RENDER_DISK_PATH") != null
    ? Path.Combine(Environment.GetEnvironmentVariable("RENDER_DISK_PATH"), "support_tickets.db")
    : Path.Combine(builder.Environment.ContentRootPath, "support_tickets.db");
```

Or use a fixed path that works on Render:

```csharp
var dbPath = Path.Combine("/opt/render/project/src/backend/SupportTicketingSystem.Api", "support_tickets.db");
```

#### Update CORS Settings

Update `Program.cs` to allow your Render frontend URL:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5173",
            "http://localhost:4200",
            "https://your-frontend-service.onrender.com" // Add your Render frontend URL
        )
        .AllowAnyMethod()
        .WithHeaders("Content-Type", "Authorization")
        .AllowCredentials();
    });
});
```

### 2️⃣ Deploy Frontend

#### Create Static Site

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings:**
   - **Name**: `support-ticketing-frontend`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Environment**: `Node`
   - **Plan**: `Free`

   **Build & Deploy:**
   - **Build Command**: 
     ```bash
     pnpm install && pnpm build
     ```
   - **Publish Directory**: `dist`

   **Environment Variables:**
   - After backend is deployed, manually add:
     - `VITE_API_URL` = `https://your-backend-service.onrender.com/api`
     - Replace `your-backend-service` with your actual backend service name
   - **Note**: Static sites don't support environment variables in `render.yaml`, so you'll need to add this manually in the Render dashboard after deployment.

5. Click **"Create Static Site"**

---

## 🔐 Environment Variables

### Backend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `ASPNETCORE_ENVIRONMENT` | `Production` | Environment mode |
| `ASPNETCORE_URLS` | `http://0.0.0.0:10000` | Server binding address |
| `PORT` | `10000` | Port number (Render sets this automatically) |

### Frontend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.onrender.com/api` | Backend API URL |

**Note**: Update `VITE_API_URL` after backend is deployed with the actual backend URL.

---

## 🗄️ Database Considerations

### SQLite on Render

⚠️ **Free Tier Limitations**:
- Render's filesystem is **ephemeral** (resets on deploy)
- **Persistent Disks are NOT available on free tier**
- SQLite database will reset on each deployment
- For production, consider:
  - Upgrading to a paid plan (to use persistent disks)
  - Migrating to **PostgreSQL** (free 90-day trial, then $7/month)

### Using Persistent Disk (Paid Plans Only)

If you upgrade to a paid plan:
1. Link a persistent disk to your backend service
2. Mount it to a specific path
3. Update database path in `Program.cs` to use the mounted path

### Alternative: PostgreSQL (Recommended for Production)

Render offers free PostgreSQL databases:

1. Create a **PostgreSQL** service in Render
2. Get the connection string
3. Update `Program.cs` to use PostgreSQL instead of SQLite:

```csharp
// Replace SQLite configuration with PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
```

4. Install PostgreSQL provider:
   ```bash
   dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
   ```

---

## 🔄 Auto-Deploy

Render automatically deploys when you push to your connected branch:

1. Push changes to GitHub
2. Render detects the push
3. Automatically builds and deploys
4. Sends email notification when complete

### Manual Deploy

To manually trigger a deploy:
1. Go to your service in Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Service fails to start
- **Solution**: Check logs in Render dashboard
- Verify `startCommand` is correct
- Ensure `PORT` environment variable is set

**Problem**: Database not persisting
- **Solution**: Ensure persistent disk is linked and mounted correctly
- Check database path in `Program.cs`

**Problem**: CORS errors
- **Solution**: Add frontend URL to CORS origins in `Program.cs`
- Verify `AllowCredentials()` is called if needed

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Verify `VITE_API_URL` is set correctly
- Check backend is running and accessible
- Ensure CORS is configured on backend

**Problem**: Build fails
- **Solution**: Check `pnpm` is available (Render should auto-detect)
- Verify `package.json` has correct scripts
- Check build logs for specific errors

### Common Issues

**Service goes to sleep (Free tier)**
- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Upgrade to paid plan to avoid spin-down

**Build timeout**
- Free tier has 10-minute build timeout
- Optimize build commands
- Consider using `.dockerignore` to exclude unnecessary files

---

## 📊 Monitoring

### View Logs

1. Go to your service in Render dashboard
2. Click **"Logs"** tab
3. View real-time logs
4. Download logs if needed

### Health Checks

Render automatically monitors your services:
- Checks if service is responding
- Restarts if service crashes
- Sends email notifications on failures

---

## 🔗 URLs

After deployment, you'll get URLs like:
- **Backend**: `https://support-ticketing-backend.onrender.com`
- **Frontend**: `https://support-ticketing-frontend.onrender.com`

### Custom Domains

To use a custom domain:
1. Go to your service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain
4. Follow DNS configuration instructions

---

## 💰 Pricing

### Free Tier
- ✅ **Web Services**: Free (with limitations)
- ✅ **Static Sites**: Free
- ✅ **PostgreSQL**: Free (90-day trial, then $7/month)
- ⚠️ Services spin down after 15 minutes of inactivity

### Paid Plans
- **Starter**: $7/month per service
- **Standard**: $25/month per service
- **Pro**: Custom pricing

See [Render Pricing](https://render.com/pricing) for details.

---

## 🎉 Next Steps

1. ✅ Deploy backend and frontend
2. ✅ Test the application
3. ✅ Set up custom domain (optional)
4. ✅ Configure monitoring and alerts
5. ✅ Consider migrating to PostgreSQL for production

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [.NET on Render](https://render.com/docs/deploy-dotnet)
- [Static Sites on Render](https://render.com/docs/static-sites)
- [PostgreSQL on Render](https://render.com/docs/databases)

---

**Need help?** Check Render's [community forum](https://community.render.com) or [support](https://render.com/support)!

