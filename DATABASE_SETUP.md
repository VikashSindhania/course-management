# Database Setup Guide - Supabase or Neon

This guide will help you set up a free PostgreSQL database using either Supabase or Neon.

## Option 1: Supabase (Recommended)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

### Step 2: Create a New Project
1. Click "New Project"
2. Fill in:
   - **Project Name**: `course-management-system` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

### Step 3: Get Connection String
1. Go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password

### Step 4: Update .env File
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```

### Step 5: Run Migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## Option 2: Neon (Alternative)

### Step 1: Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Click "Sign Up" (GitHub recommended)
3. Complete signup

### Step 2: Create a New Project
1. Click "Create Project"
2. Fill in:
   - **Project Name**: `course-management-system`
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: 15 or 16 (both work)
3. Click "Create Project"

### Step 3: Get Connection String
1. After project creation, you'll see a connection string
2. It looks like:
   ```
   postgresql://[user]:[password]@[endpoint]/[dbname]?sslmode=require
   ```
3. Click "Copy" to copy the full connection string

### Step 4: Update .env File
```env
DATABASE_URL="postgresql://[user]:[password]@[endpoint]/[dbname]?sslmode=require"
```

### Step 5: Run Migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## Quick Setup Commands

After getting your connection string:

1. **Create .env file** (if not exists):
   ```bash
   # Copy from .env.example
   cp .env.example .env
   ```

2. **Add DATABASE_URL to .env**:
   ```env
   DATABASE_URL="your-connection-string-here"
   JWT_SECRET="your-random-secret-key-here"
   OPENAI_API_KEY="optional-openai-key"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="another-random-secret"
   ```

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Run Database Migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Verify Connection** (optional):
   ```bash
   npx prisma studio
   ```
   This opens a visual database browser at http://localhost:5555

---

## Troubleshooting

### Connection Issues
- **Error: Connection timeout**
  - Check if your IP needs to be whitelisted (Supabase)
  - Verify connection string is correct
  - Ensure database is active (not paused)

### Migration Errors
- **Error: Schema already exists**
  - Database might have existing tables
  - Try: `npx prisma migrate reset` (⚠️ deletes all data)
  - Or: `npx prisma db push` (alternative to migrations)

### SSL Issues (Neon)
- Make sure connection string includes `?sslmode=require`
- Neon requires SSL connections

---

## For Production Deployment

When deploying to Vercel:

1. **Get Production Connection String**
   - Supabase: Settings → Database → Connection string (use same or create new)
   - Neon: Project settings → Connection string

2. **Add to Vercel Environment Variables**
   - Go to Vercel project settings
   - Add `DATABASE_URL` with your production connection string

3. **Run Production Migrations**
   ```bash
   npx prisma migrate deploy
   ```
   Or Vercel will run this automatically if configured

---

## Free Tier Limits

### Supabase
- ✅ 500 MB database storage
- ✅ 2 GB bandwidth
- ✅ Unlimited API requests
- ✅ Perfect for development and small projects

### Neon
- ✅ 3 GB storage
- ✅ Unlimited projects
- ✅ Auto-suspend after 5 minutes of inactivity (auto-resumes)
- ✅ Great for development

Both are perfect for this assignment! 🎉

