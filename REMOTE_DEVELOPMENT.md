# 📱 Remote Development Guide for iOS/Mobile

This guide helps you develop and access your Support Ticketing System from iOS devices or any mobile platform.

---

## 🎯 Quick Overview

Since Cursor doesn't have an iOS app, here are the best options:

1. **GitHub Codespaces** ⭐ (Recommended) - Full VS Code in browser
2. **Remote Desktop** - Access your Mac/PC running Cursor
3. **GitPod** - Cloud-based VS Code alternative
4. **SSH + Terminal** - Command-line development

---

## 1️⃣ GitHub Codespaces (Recommended)

### Why Codespaces?
- ✅ **Full VS Code experience** in Safari on iOS
- ✅ **Free tier** - 60 hours/month for personal accounts
- ✅ **Pre-configured** - Works with your GitHub repo
- ✅ **No setup needed** - Just open in browser
- ✅ **Runs on GitHub's servers** - No local machine needed

### Setup

#### Step 1: Create `.devcontainer` Configuration

Create `.devcontainer/devcontainer.json` in your repo root:

```json
{
  "name": "Support Ticketing System",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/dotnet:2": {
      "version": "8.0"
    },
    "ghcr.io/devcontainers/features/node:1": {
      "version": "20"
    }
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-dotnettools.csharp",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "bradlc.vscode-tailwindcss",
        "ms-playwright.playwright"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      }
    }
  },
  "forwardPorts": [5000, 5173],
  "portsAttributes": {
    "5000": {
      "label": "Backend API",
      "onAutoForward": "notify"
    },
    "5173": {
      "label": "Frontend Dev Server",
      "onAutoForward": "notify"
    }
  },
  "postCreateCommand": "bash .devcontainer/setup.sh",
  "remoteUser": "vscode"
}
```

#### Step 2: Create Setup Script

Create `.devcontainer/setup.sh`:

```bash
#!/bin/bash

# Install pnpm
npm install -g pnpm

# Setup backend
cd backend
dotnet restore
dotnet build

# Setup frontend
cd ../frontend
pnpm install

echo "✅ Development environment ready!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
```

#### Step 3: Create `.devcontainer/.dockerignore`

```
node_modules/
bin/
obj/
*.db
*.db-shm
*.db-wal
.git/
```

#### Step 4: Push to GitHub

```bash
git add .devcontainer/
git commit -m "Add Codespaces configuration"
git push
```

#### Step 5: Open in Codespaces

1. Go to your GitHub repository
2. Click the **"Code"** button (green)
3. Select **"Codespaces"** tab
4. Click **"Create codespace on main"**
5. Wait for environment to build (~2-3 minutes)
6. Open in Safari on iOS - it works perfectly!

### Using Codespaces on iOS

- **Full VS Code interface** in Safari
- **Terminal access** for running commands
- **Port forwarding** - Access your dev servers
- **Git integration** - Commit and push directly
- **Extensions** - Install VS Code extensions

### Running Your App in Codespaces

```bash
# Terminal 1: Backend
cd backend/SupportTicketingSystem.Api
dotnet run

# Terminal 2: Frontend
cd frontend
pnpm dev
```

The ports will be automatically forwarded and accessible via URLs provided by Codespaces.

---

## 2️⃣ Remote Desktop Solutions

### Option A: Jump Desktop (iOS App)

**Best for:** Accessing your Mac running Cursor

1. **Install Jump Desktop** on iOS (App Store)
2. **Install Jump Desktop** on your Mac
3. **Set up connection** (local network or cloud)
4. **Connect from iOS** - Full Mac screen with Cursor

**Pros:**
- ✅ Full Cursor experience
- ✅ Native performance
- ✅ All your local files

**Cons:**
- ❌ Requires Mac to be on
- ❌ Needs good network connection

### Option B: Microsoft Remote Desktop

1. **Enable Remote Desktop** on Mac:
   ```bash
   # System Settings > General > Sharing > Remote Management
   ```

2. **Install Microsoft Remote Desktop** on iOS

3. **Connect** using your Mac's IP address

### Option C: Chrome Remote Desktop

1. **Install Chrome Remote Desktop** on Mac
2. **Install Chrome Remote Desktop** on iOS
3. **Set up remote access**
4. **Connect from iOS**

---

## 3️⃣ GitPod (Alternative Cloud IDE)

### Why GitPod?
- ✅ **Free tier** - 50 hours/month
- ✅ **VS Code-based** - Familiar interface
- ✅ **Prebuilds** - Fast environment setup
- ✅ **Works on iOS** - Browser-based

### Setup

#### Create `.gitpod.yml` (Root)

```yaml
image: gitpod/workspace-dotnet

tasks:
  - name: Setup Backend
    init: |
      cd backend
      dotnet restore
      dotnet build
    command: |
      cd backend/SupportTicketingSystem.Api
      dotnet run

  - name: Setup Frontend
    init: |
      npm install -g pnpm
      cd frontend
      pnpm install
    command: |
      cd frontend
      pnpm dev

ports:
  - port: 5000
    onOpen: open-browser
    visibility: public
  - port: 5173
    onOpen: open-browser
    visibility: public

vscode:
  extensions:
    - ms-dotnettools.csharp
    - dbaeumer.vscode-eslint
    - esbenp.prettier-vscode
```

### Usage

1. Go to [gitpod.io](https://gitpod.io)
2. Sign in with GitHub
3. Open your repository: `https://gitpod.io/#https://github.com/yourusername/support-ticketing-system`
4. Works in Safari on iOS!

---

## 4️⃣ SSH + Terminal Development

### Setup SSH Access

#### On Your Mac

1. **Enable SSH**:
   ```bash
   sudo systemsetup -setremotelogin on
   ```

2. **Find your IP**:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

#### On iOS

1. **Install Blink Shell** or **Termius** (App Store)

2. **Connect via SSH**:
   ```bash
   ssh username@your-mac-ip
   ```

3. **Use terminal editors**:
   ```bash
   # Vim
   vim frontend/src/components/TicketDashboard/index.tsx
   
   # Nano (easier for mobile)
   nano frontend/src/components/TicketDashboard/index.tsx
   ```

### Running Your App via SSH

```bash
# Backend
cd backend/SupportTicketingSystem.Api
dotnet run

# Frontend (in another terminal)
cd frontend
pnpm dev
```

Then access via your Mac's IP address in Safari on iOS.

---

## 5️⃣ Comparison Matrix

| Solution | iOS Support | Setup Time | Cost | Best For |
|----------|------------|------------|------|----------|
| **GitHub Codespaces** | ✅ Excellent | ⭐⭐ Medium | Free tier | Full development |
| **GitPod** | ✅ Excellent | ⭐⭐ Medium | Free tier | Full development |
| **Remote Desktop** | ✅ Good | ⭐ Easy | Free | Access local Cursor |
| **SSH + Terminal** | ⚠️ Limited | ⭐⭐ Medium | Free | Command-line work |

---

## 🎯 Recommended Workflow

### For iOS Development:

1. **Primary:** GitHub Codespaces
   - Full VS Code experience
   - No local machine needed
   - Works anywhere

2. **Backup:** Remote Desktop
   - When you need Cursor specifically
   - Access your Mac remotely

3. **Quick edits:** SSH + Terminal
   - Fast command-line access
   - Use vim/nano for quick changes

---

## 🚀 Quick Start: GitHub Codespaces

1. **Add `.devcontainer`** folder to your repo (see above)

2. **Push to GitHub**:
   ```bash
   git add .devcontainer/
   git commit -m "Add Codespaces support"
   git push
   ```

3. **Open in Codespaces**:
   - Go to GitHub repo
   - Click "Code" → "Codespaces" → "Create codespace"

4. **Open in Safari on iOS** - Start coding!

---

## 📝 Tips for Mobile Development

### Keyboard Shortcuts
- Use **external keyboard** with iPad for better experience
- Learn **touch gestures** for navigation
- Use **split view** on iPad for better multitasking

### Performance
- **Close unused tabs** in Safari
- **Use WiFi** instead of cellular for better performance
- **Enable "Request Desktop Website"** in Safari settings

### Workflow
- **Commit often** - Easier to revert on mobile
- **Use Git GUI** - GitHub mobile app for quick commits
- **Test locally** - Use remote desktop for testing

---

## 🔧 Troubleshooting

### Codespaces Issues

**"No space left on device" error:**
- The `universal:2` image is very large and can exceed free tier limits
- **Solution:** Use `mcr.microsoft.com/devcontainers/base:ubuntu` instead (already configured)
- This uses a lighter base image with only essential tools

**Port not accessible:**
- Check port forwarding in Codespaces
- Use the forwarded URL provided by Codespaces

**Slow performance:**
- Codespaces free tier has limited resources
- Consider upgrading for better performance

### Remote Desktop Issues

**Connection refused:**
- Check firewall settings
- Ensure Mac is on same network (or use cloud connection)

**Laggy experience:**
- Use good WiFi connection
- Reduce screen resolution in remote desktop settings

---

## 📚 Additional Resources

- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)
- [GitPod Docs](https://www.gitpod.io/docs)
- [VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview)

---

**Happy coding on iOS! 🎉**

