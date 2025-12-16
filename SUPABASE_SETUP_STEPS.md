# Step-by-Step Supabase Setup Guide

## Step 1: Create Supabase Account

1. **Open your web browser**
2. **Go to**: https://supabase.com
3. **Click** the **"Start your project"** button (top right)
4. **Sign up** using one of these methods:
   - **GitHub** (recommended - fastest)
   - Google
   - Email

## Step 2: Create a New Project

1. After signing up, you'll see the Supabase dashboard
2. **Click** the **"New Project"** button (green button)
3. Fill in the project details:
   - **Name**: `course-management-system` (or any name you like)
   - **Database Password**:
     - **IMPORTANT**: Create a STRONG password
     - Write it down or save it somewhere safe!
     - You'll need this password later
   - **Region**: Choose the closest region to you
     - Examples: "Southeast Asia (Singapore)", "US East (Ohio)", etc.
4. **Click** **"Create new project"**
5. **Wait 2-3 minutes** for Supabase to set up your database

## Step 3: Get Your Connection String

1. Once your project is ready, you'll see the project dashboard
2. **Click** on **"Settings"** in the left sidebar (gear icon at the bottom)
3. **Click** on **"Database"** in the settings menu
4. Scroll down to find **"Connection string"** section
5. You'll see different connection string formats
6. **Click** on the **"URI"** tab
7. You'll see a connection string like this:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
8. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the actual password you created in Step 2
9. **Copy the entire connection string** (after replacing the password)

## Step 4: Update Your .env File

1. **Open** the `.env` file in your project folder
2. **Find** the line: `DATABASE_URL=...`
3. **Replace** the entire value with your Supabase connection string
4. **Save** the file

Example:

```env
DATABASE_URL="postgresql://postgres.xxxxx:your-actual-password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

## Step 5: Test the Connection

After updating the .env file, we'll test if it works in the next steps!

---

## Troubleshooting

**Problem**: Can't find the connection string

- **Solution**: Make sure you're in Settings → Database, not Settings → API

**Problem**: Connection string has [YOUR-PASSWORD] placeholder

- **Solution**: You need to manually replace it with your actual password

**Problem**: Project is still setting up

- **Solution**: Wait a few more minutes, refresh the page

**Problem**: Forgot your database password

- **Solution**: Go to Settings → Database → Reset database password

---

## Visual Guide Locations

- **Settings**: Bottom left of dashboard (gear icon)
- **Database**: Under Settings menu
- **Connection string**: Scroll down in Database settings
- **URI tab**: Click on "URI" tab in Connection string section
