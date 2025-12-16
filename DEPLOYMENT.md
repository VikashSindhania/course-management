# Deployment Guide

## Pre-Deployment Checklist

- [ ] Update footer with your name, GitHub, and LinkedIn
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Test all features locally
- [ ] Run build command successfully

## Vercel Deployment

### Step 1: Prepare Repository
```bash
# Ensure all files are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings

2. **Via Vercel CLI**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

### Step 3: Configure Environment Variables

In Vercel dashboard, add these environment variables:
- `DATABASE_URL` - Your production database URL
- `JWT_SECRET` - Strong random secret
- `OPENAI_API_KEY` - Your OpenAI API key (optional)
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - Random secret

### Step 4: Database Setup

**Option 1: Vercel Postgres**
- Add Vercel Postgres integration
- Use provided connection string

**Option 2: External Database (Supabase, Neon, etc.)**
- Create database instance
- Run migrations: `npx prisma migrate deploy`
- Update `DATABASE_URL`

### Step 5: Run Migrations

```bash
# In Vercel deployment or via CLI
npx prisma migrate deploy
```

## CI/CD Setup

The project includes GitHub Actions workflow (`.github/workflows/ci.yml`).

**Required GitHub Secrets:**
- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Post-Deployment

1. **Verify Deployment**
   - Check all pages load correctly
   - Test authentication
   - Test CRUD operations
   - Verify AI features (if enabled)

2. **Monitor**
   - Check Vercel logs
   - Monitor database connections
   - Set up error tracking (optional)

3. **Update Footer**
   - Edit `components/Footer.tsx`
   - Commit and push changes
   - Vercel will auto-deploy

## Performance Optimization

- ✅ Code splitting (automatic with Next.js)
- ✅ Image optimization (Next.js Image component)
- ✅ Static generation where possible
- ✅ Database query optimization
- ✅ Caching strategies

## Security Checklist

- ✅ Environment variables secured
- ✅ HTTPS enabled (automatic on Vercel)
- ✅ Security headers configured
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ CORS configured

