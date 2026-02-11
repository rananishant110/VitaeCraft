# Deployment Guide - VitaeCraft

## Local Development

By default, the app uses `.env` file for local development.

```bash
# Start backend (uses .env)
cd backend
python3 -m uvicorn server:app --reload --port 8001

# Start frontend
cd frontend
npm start
```

---

## 🚀 Production Deployment: Vercel (Option 1)

### Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **PostgreSQL Database** - Free tier at:
   - [Vercel Postgres](https://vercel.com/storage/postgres) (recommended - auto-integrated)
   - [Neon](https://neon.tech) (free tier available)
   - [Railway](https://railway.app) (free $5/mo credits)

### Step 1: Set Up PostgreSQL Database

#### Option A: Vercel Postgres (Recommended)
1. In Vercel dashboard, go to **Storage** → **Create Database** → **Postgres**
2. Copy the connection string (automatically added to environment)

#### Option B: Neon or Railway
1. Create account and new database
2. Get connection string in format: `postgresql+asyncpg://user:password@host:5432/db_name`

### Step 2: Create Vercel Configuration File

Create `vercel.json` in root directory:

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/build",
  "framework": "react",
  "env": {
    "DATABASE_URL": "@database_url",
    "DB_NAME": "vitaecraft_prod",
    "OPENAI_API_KEY": "@openai_api_key",
    "STRIPE_API_KEY": "@stripe_api_key",
    "STRIPE_WEBHOOK_SECRET": "@stripe_webhook_secret",
    "JWT_SECRET": "@jwt_secret",
    "RESEND_API_KEY": "@resend_api_key",
    "SENDER_EMAIL": "@sender_email",
    "FRONTEND_URL": "@frontend_url",
    "CORS_ORIGINS": "@cors_origins"
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 3: Create Backend API Wrapper for Vercel

Create `api/index.py` in root to handle serverless backend:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

from server import app

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vercel serverless handler
handler = Mangum(app, lifespan="off")
```

Add to `backend/requirements.txt`:
```
mangum==0.17.0
```

### Step 4: Configure Frontend for Vercel

Update `frontend/.env.production`:

```bash
REACT_APP_BACKEND_URL=https://your-vercel-domain.vercel.app/api
```

### Step 5: Push to GitHub

```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Step 6: Deploy Frontend on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select root directory: `/`
4. **Project Settings:**
   - Framework Preset: **Next.js**
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`
5. **Environment Variables:** Add all from `.env.production`
6. Click **Deploy**

### Step 7: Deploy Backend on Vercel

1. In Vercel dashboard, go to your project
2. **Settings** → **Functions**
3. Ensure Python runtime is enabled
4. Backend will be deployed automatically as serverless functions at:
   ```
   https://your-vercel-domain.vercel.app/api/
   ```

### Step 8: Test

- Frontend: `https://your-vercel-domain.vercel.app`
- Backend: `https://your-vercel-domain.vercel.app/api`
- Try registration: Should work if MongoDB & APIs configured

---

## ⚠️ Vercel Serverless Limitations

| Issue | Impact | Solution |
|-------|--------|----------|
| **Cold starts** | First request is slow | Normal for serverless, can use Vercel Pro |
| **10s timeout** | Long requests fail | FastAPI routes must be fast |
| **No persistent storage** | Can't use local files | Use MongoDB or S3 |
| **PDF generation** | ReportLab might fail | May need to optimize or use render.com |

---

## 🔄 Alternative: Backend on Render.com

If Vercel backend has issues, deploy backend separately to Render:

```bash
# Push code to GitHub
git push origin main

# Go to render.com → New → Web Service
# Connect GitHub repository
# Settings:
# - Root Directory: backend
# - Build Command: pip install -r requirements.txt
# - Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
# - Add Environment Variables from .env.production
```

Then update frontend:
```bash
# frontend/.env.production
REACT_APP_BACKEND_URL=https://your-render-backend.onrender.com/api
```

---

## Production Deployment: Manual Server

### Step 1: Configure Production Environment Variables

Edit `backend/.env.production` with your production values:

```bash
# MongoDB Configuration (use MongoDB Atlas or your hosted instance)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=vitaecraft_prod

# CORS Settings (your production frontend domain)
CORS_ORIGINS=https://yourdomain.com

# OpenAI API Key
OPENAI_API_KEY=sk-proj-xxx

# Stripe Configuration
STRIPE_API_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# JWT Secret (generate a secure random string)
JWT_SECRET=your_secure_random_string_here

# Resend Email Service
RESEND_API_KEY=re_xxx
SENDER_EMAIL=noreply@yourdomain.com

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

### Step 2: Start Backend in Production Mode

Set the `ENV` environment variable to `production`:

```bash
cd backend
ENV=production python3 -m uvicorn server:app --host 0.0.0.0 --port 8001
```

Or with gunicorn for production:

```bash
ENV=production gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001
```

### Step 3: Frontend Production Build

Update `frontend/.env` for production:

```bash
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

Build the frontend:

```bash
cd frontend
npm run build
```

Deploy the `build/` folder to your hosting service (Vercel, Netlify, AWS S3, etc.)

## Environment Files Summary

| File | Purpose | Git Tracked |
|------|---------|-------------|
| `.env` | Local development | ❌ No (in .gitignore) |
| `.env.production` | Production values | ❌ No (in .gitignore) |
| `.env.example` | Template/documentation | ✅ Yes |

## Security Notes

⚠️ **NEVER commit `.env` or `.env.production` files to git!**

- Generate strong random strings for JWT_SECRET
- Use MongoDB Atlas or managed MongoDB for production
- Use production Stripe keys (not test keys)
- Enable CORS only for your specific domain
- Use HTTPS for all production endpoints

## Quick Deployment Checklist

- [ ] Set up MongoDB Atlas or hosted MongoDB
- [ ] Configure `.env.production` with real credentials
- [ ] Generate secure JWT_SECRET
- [ ] Set up Stripe webhook endpoint
- [ ] Configure domain in CORS_ORIGINS
- [ ] Test email sending with Resend
- [ ] Build frontend with production backend URL
- [ ] Deploy frontend to hosting service
- [ ] Deploy backend to hosting service (AWS, Railway, Render, etc.)
- [ ] Set ENV=production on backend server
- [ ] Test end-to-end flow in production
