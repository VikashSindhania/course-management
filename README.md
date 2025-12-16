# Course Management System

A comprehensive full-stack learning management system built with Next.js 16, featuring complete CRUD operations, secure authentication, and AI-powered course recommendations.

## 🚀 Features

### Core Functionality
- 🎓 **Course Management**: Full CRUD operations for courses
- 📚 **Lesson Management**: Create, edit, and organize lessons within courses
- 👥 **User Management**: Role-based access (Student, Instructor, Admin)
- 📊 **Enrollment System**: Track student progress and enrollments
- 🔍 **Search & Filter**: Find courses by category, level, and keywords

### Security & Authentication
- 🔐 **JWT-based Authentication**: Secure token-based authentication
- 🛡️ **Role-based Authorization**: Granular access control
- 🔒 **Data Validation**: Zod schema validation for all inputs
- 🚫 **Security Headers**: XSS, CSRF, and injection protection

### AI Features
- 🤖 **AI Recommendations**: Personalized course recommendations using OpenAI
- 🎯 **Smart Suggestions**: Based on user enrollment history and interests

### User Experience
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- ♿ **Accessible**: WCAG-compliant components
- ⚡ **Fast Performance**: SSR, code splitting, and optimized queries
- 🎨 **Modern UI**: Clean and intuitive interface

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: JWT with HTTP-only cookies
- **Validation**: Zod
- **AI**: OpenAI API (optional)
- **Deployment**: Vercel with CI/CD

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL database (use free **Supabase** or **Neon** - see [DATABASE_SETUP.md](./DATABASE_SETUP.md))
- OpenAI API key (optional, for AI features)

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd "CRUD Assignment"
npm install
```

### 2. Database Setup

**Choose one option:**

- **Supabase** (Recommended): [supabase.com](https://supabase.com) → Create project → Get connection string
- **Neon**: [neon.tech](https://neon.tech) → Create project → Get connection string

📖 **Detailed instructions**: See [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="your-supabase-or-neon-connection-string"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
OPENAI_API_KEY="your-openai-api-key"  # Optional
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

**Generate random secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Database Schema Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### As a Student
1. Register/Login
2. Browse courses
3. Enroll in courses
4. View AI recommendations
5. Track progress

### As an Instructor
1. Register/Login as Instructor
2. Create courses
3. Add lessons to courses
4. Edit/Delete your courses
5. View enrolled students

### As an Admin
1. Full access to all features
2. Can edit/delete any course
3. Manage all content

## 🧪 Testing

1. **Create Test Users**
   - Register with different roles (Student, Instructor, Admin)

2. **Test CRUD Operations**
   - Create courses and lessons
   - Edit existing content
   - Delete items
   - Verify authorization rules

3. **Test Features**
   - Search and filter courses
   - Enroll in courses
   - Check AI recommendations
   - Verify authentication flow

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

The project includes:
- ✅ Vercel configuration (`vercel.json`)
- ✅ CI/CD pipeline (`.github/workflows/ci.yml`)
- ✅ Production-ready build settings

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── courses/           # Course pages
│   ├── dashboard/         # Dashboard page
│   └── ...
├── components/            # React components
├── lib/                  # Utilities and helpers
│   ├── auth.ts          # Authentication logic
│   ├── prisma.ts        # Database client
│   └── validations.ts   # Zod schemas
├── prisma/              # Database schema
└── public/             # Static assets
```

## 🔒 Security Features

- ✅ Input validation and sanitization
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure password hashing (bcrypt)
- ✅ HTTP-only cookies
- ✅ Security headers middleware
- ✅ Role-based access control

## ⚡ Performance Optimizations

- ✅ Server-side rendering (SSR)
- ✅ Code splitting
- ✅ Optimized database queries
- ✅ Efficient caching strategies
- ✅ Image optimization ready

## 📝 Important Notes

### Before Submission

1. **Update Footer** (`components/Footer.tsx`):
   - Replace "Your Name" with your actual name
   - Update GitHub profile URL
   - Update LinkedIn profile URL

2. **Environment Variables**:
   - Use strong secrets in production
   - Never commit `.env` file

3. **Database**:
   - Set up production database
   - Run migrations before deployment

## 🤝 Contributing

This is an assignment project. For questions or issues, please contact the developer.

## 📄 License

This project is created for educational purposes as part of a full-stack developer assignment.

## 👤 Developer

**Name**: [Update in Footer]  
**GitHub**: [Update in Footer]  
**LinkedIn**: [Update in Footer]

---

Built with ❤️ using Next.js 16

