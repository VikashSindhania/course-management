# Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (use free Supabase or Neon - see [DATABASE_SETUP.md](./DATABASE_SETUP.md))
- OpenAI API key (optional, for AI features)

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Database (Supabase or Neon)**
   
   **Quick Setup:**
   - **Supabase**: Go to [supabase.com](https://supabase.com) → Create project → Get connection string
   - **Neon**: Go to [neon.tech](https://neon.tech) → Create project → Get connection string
   
   See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions.

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your-supabase-or-neon-connection-string"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   OPENAI_API_KEY="your-openai-api-key" # Optional
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```
   
   **Generate secrets:**
   ```bash
   # Generate random secrets (run in terminal)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Set Up Database Schema**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev --name init
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Set Up Database**
   - Use Vercel Postgres or any PostgreSQL hosting (e.g., Supabase, Neon)
   - Update `DATABASE_URL` in Vercel environment variables

4. **Update Footer**
   - Edit `components/Footer.tsx`
   - Replace "Your Name" with your actual name
   - Update GitHub and LinkedIn URLs

## Features Implemented

✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (Student, Instructor, Admin)
- Secure password hashing with bcrypt

✅ **CRUD Operations**
- Courses: Create, Read, Update, Delete
- Lessons: Create, Read, Update, Delete
- User enrollment management

✅ **AI Features**
- AI-powered course recommendations based on user interests
- Uses OpenAI API (with fallback to rule-based recommendations)

✅ **Security**
- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- XSS protection
- Security headers via middleware
- HTTP-only cookies for tokens

✅ **Performance**
- Server-side rendering (SSR)
- Code splitting
- Optimized database queries
- Caching strategies

✅ **UI/UX**
- Responsive design with Tailwind CSS
- Accessible components
- Clean and modern interface
- Loading states and error handling

## Testing

1. **Create Test Users**
   - Register as Student
   - Register as Instructor
   - Register as Admin

2. **Test Course Management**
   - Create courses (as Instructor/Admin)
   - Edit courses
   - Delete courses
   - View course details

3. **Test Enrollment**
   - Enroll in courses (as Student)
   - View enrolled courses in dashboard
   - Check AI recommendations

4. **Test Lessons**
   - Add lessons to courses
   - Edit lessons
   - Delete lessons

## Troubleshooting

- **Database Connection Issues**: 
  - Check `DATABASE_URL` in `.env`
  - Verify connection string format
  - See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for help
- **Authentication Errors**: Verify `JWT_SECRET` is set
- **AI Features Not Working**: Check `OPENAI_API_KEY` (optional feature)
- **Build Errors**: Run `npx prisma generate` before building
- **Migration Errors**: Try `npx prisma db push` as alternative

