# Local Development Setup Guide - ITSM Pro

## 1. Required Software (Windows 10/11)
Before running the project, install the following:

| Software | Download Link | Purpose |
| :--- | :--- | :--- |
| Node.js (v20 LTS) | https://nodejs.org/ | Backend & Frontend runtime |
| pnpm | `npm install -g pnpm` | Package manager |
| PostgreSQL (v15+) | https://www.postgresql.org/download/windows/ | Database |
| Redis (Windows) | https://github.com/tporadowski/redis/releases | Background jobs |
| Git | https://git-scm.com/ | Version control |
| VS Code | https://code.visualstudio.com/ | Code editor |
| .NET 8 SDK | https://dotnet.microsoft.com/download/dotnet/8.0 | Windows Agent (optional for now) |

## 2. Step-by-Step Setup

### Step 1: Install Node.js & pnpm
- Download and install Node.js v20 LTS.
- Open PowerShell and verify: `node -v` (should show v20.x)
- Install pnpm: `npm install -g pnpm`

### Step 2: Install PostgreSQL
- Download the Windows installer from the link above.
- During installation, set a password for the `postgres` user (remember this!).
- Keep the default port `5432`.
- Create a new database named `itsm_pro_dev` using pgAdmin or the command line.

### Step 3: Install Redis
- Download the Redis Windows build from the link above.
- Extract the ZIP to `C:\Redis`.
- Run `redis-server.exe` to start Redis.

### Step 4: Clone/Extract the Project
- Extract the downloaded ZIP to a folder like `C:\Projects\itsm-pro`.
- Open the folder in VS Code.

### Step 5: Configure Environment
- Copy `.env.example` to `.env` in both `apps/api` and `apps/web`.
- Edit `apps/api/.env`: