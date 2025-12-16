# Quick Start Guide

Get your Course Management System running in 5 minutes! 🚀

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Free Database

### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Sign up (GitHub recommended)
3. Click "New Project"
4. Fill in project details
5. Wait 2 minutes for setup
6. Go to **Settings** → **Database**
7. Copy the **Connection string** (URI format)
8. Replace `[YOUR-PASSWORD]` with your database password

### Option B: Neon
1. Go to [neon.tech](https://neon.tech)
2. Sign up (GitHub recommended)
3. Click "Create Project"
4. Copy the connection string shown

## Step 3: Create .env File

Create a `.env` file in the root directory:

```env
DATABASE_URL="your-connection-string-from-step-2"
JWT_SECRET="generate-random-secret-below"
OPENAI_API_KEY="optional"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret-below"
```

**Generate random secrets:**
```bash
# Run this twice to get two different secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Set Up Database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Step 6: Create Your First User

1. Go to [http://localhost:3000/register](http://localhost:3000/register)
2. Register as an **Instructor** or **Admin**
3. Start creating courses!

## Need Help?

- **Database setup issues?** → See [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- **Full setup guide?** → See [SETUP.md](./SETUP.md)
- **Deployment?** → See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Common Issues

**"Can't connect to database"**
- Check your connection string format
- Make sure password is correct
- Verify database is active (not paused)

**"Migration failed"**
- Try: `npx prisma db push` instead
- Or: `npx prisma migrate reset` (⚠️ deletes data)

**"Module not found"**
- Run: `npm install` again
- Delete `node_modules` and `.next` folder, then reinstall

---

That's it! You're ready to build your course management system! 🎓

