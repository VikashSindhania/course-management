# MongoDB Conversion - Quick Reference

All API routes have been converted from Prisma to MongoDB/Mongoose.

## What Changed:

1. **Database Connection**: `lib/mongodb.ts` (replaces `lib/prisma.ts`)
2. **Models**: `lib/models/User.ts`, `Course.ts`, `Lesson.ts`, `Enrollment.ts`
3. **All API Routes**: Now use Mongoose instead of Prisma

## Environment Variable:

Add to `.env`:
```
MONGODB_URI=mongodb://localhost:27017/course_management
```

## Next Steps:

1. Make sure MongoDB is running locally
2. Update `.env` with MONGODB_URI
3. Run `npm run dev`
4. Test registration/login

