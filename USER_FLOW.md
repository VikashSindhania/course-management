# User Flow Guide

This document explains the complete user journey through the Course Management System.

## 🏠 Landing Page (localhost:3000)

When you first visit the application, you'll see:

- **Welcome message**: "Welcome to Course Management System"
- **Two buttons**: Login and Register
- **Navigation**: Login and Register links in the top right

---

## 📝 Step 1: Registration

### Path: Click "Register" button or `/register`

**What you can do:**

1. Fill in registration form:

   - **Name**: Your full name
   - **Email**: Your email address
   - **Password**: At least 6 characters
   - **Role**: Choose one:
     - **Student**: Can enroll in courses and view lessons
     - **Instructor**: Can create and manage courses
     - **Admin**: Full access to everything

2. Click "Register" button
3. You'll be automatically logged in and redirected to **Dashboard**

---

## 🔐 Step 2: Login (Alternative)

### Path: Click "Login" button or `/login`

**What you can do:**

1. Enter your email and password
2. Click "Login"
3. You'll be redirected to **Dashboard**

---

## 📊 Step 3: Dashboard (`/dashboard`)

After logging in, you'll see your personalized dashboard:

### For Students:

- **Statistics Cards**:

  - Total enrolled courses
  - Completed courses
  - Courses in progress

- **My Courses Section**:

  - List of all enrolled courses
  - Progress bars for each course
  - "Continue" button to resume learning

- **AI Recommendations Section**:
  - Personalized course suggestions
  - Based on your enrollment history
  - Click "View Course" to see details

### For Instructors/Admins:

- Same dashboard view
- Additional access to create/edit courses

---

## 📚 Step 4: Browse Courses (`/courses`)

### Path: Click "Courses" in navbar or go to `/courses`

**What you can do:**

1. **View All Courses**:

   - Grid layout showing all available courses
   - Each card shows:
     - Course title
     - Description
     - Category, Level, Duration
     - Number of lessons and students

2. **Search & Filter**:

   - **Search bar**: Type keywords to search courses
   - **Category filter**: Filter by course category
   - **Level filter**: Filter by Beginner/Intermediate/Advanced

3. **View Course Details**:
   - Click "View" button on any course card
   - Or click on the course card itself

---

## 🎓 Step 5: Course Details (`/courses/[id]`)

### Path: Click on any course from `/courses` page

**What you'll see:**

- **Course Header**:

  - Course image (if available)
  - Title and description
  - Category, Level, Duration badges
  - Instructor name
  - Number of enrolled students

- **Actions Available**:

  - **Enroll Button** (if not enrolled): Click to enroll in the course
  - **Edit Button** (if you're the instructor/admin): Edit course details

- **Lessons Section**:

  - List of all lessons in order
  - Each lesson shows:
    - Lesson number and title
    - Content preview
    - Duration
    - Video link (if available)

- **For Instructors/Admins**:
  - "Add Lesson" button to create new lessons
  - "Edit" button on each lesson

---

## ➕ Step 6: Create Course (Instructors/Admins Only)

### Path: Click "Create Course" button or `/courses/new`

**What you can do:**

1. Fill in course form:

   - **Title**: Course name
   - **Description**: Detailed course description
   - **Instructor Name**: Your name or instructor name
   - **Category**: e.g., "Web Development", "Data Science"
   - **Duration**: Total hours
   - **Level**: Beginner/Intermediate/Advanced
   - **Image URL**: Optional course cover image

2. Click "Create Course"
3. You'll be redirected to the new course page

---

## ✏️ Step 7: Edit Course (Instructors/Admins Only)

### Path: Click "Edit Course" button on course detail page or `/courses/[id]/edit`

**What you can do:**

1. Modify any course field
2. Click "Update Course" to save changes
3. Or click "Cancel" to go back

---

## 📖 Step 8: Add Lesson (Instructors/Admins Only)

### Path: Click "Add Lesson" on course detail page or `/courses/[id]/lessons/new`

**What you can do:**

1. Fill in lesson form:

   - **Title**: Lesson name
   - **Content**: Full lesson content/text
   - **Order**: Lesson number (1, 2, 3, etc.)
   - **Duration**: Minutes required
   - **Video URL**: Optional video link

2. Click "Create Lesson"
3. Lesson will be added to the course

---

## ✏️ Step 9: Edit Lesson (Instructors/Admins Only)

### Path: Click "Edit" on any lesson or `/courses/[id]/lessons/[lessonId]/edit`

**What you can do:**

1. Modify lesson details
2. Click "Update Lesson" to save
3. Or click "Cancel" to go back

---

## 🗑️ Step 10: Delete Operations

### Delete Course:

- Only course author or admin can delete
- Navigate to course detail page
- Click "Edit Course" → Delete option (or use API directly)

### Delete Lesson:

- Only course author or admin can delete
- Navigate to lesson edit page
- Delete option available

---

## 🔄 Complete User Journey Examples

### Journey 1: Student Learning Path

```
1. Register as Student
   ↓
2. View Dashboard → See AI Recommendations
   ↓
3. Browse Courses → Search/Filter
   ↓
4. View Course Details → Read description
   ↓
5. Enroll in Course → Now enrolled
   ↓
6. View Dashboard → See enrolled course with progress
   ↓
7. Return to Course → View lessons
   ↓
8. Learn from lessons → Track progress
```

### Journey 2: Instructor Teaching Path

```
1. Register as Instructor
   ↓
2. View Dashboard
   ↓
3. Click "Create Course"
   ↓
4. Fill course details → Create
   ↓
5. View new course → Add lessons
   ↓
6. Create multiple lessons
   ↓
7. Edit course/lessons as needed
   ↓
8. View enrolled students count
```

### Journey 3: Admin Management Path

```
1. Register as Admin
   ↓
2. Full access to all features
   ↓
3. Can create/edit/delete any course
   ↓
4. Can manage all content
   ↓
5. Can view all courses and users
```

---

## 🎯 Key Features by Role

### 👨‍🎓 Student

- ✅ Browse all courses
- ✅ Search and filter courses
- ✅ Enroll in courses
- ✅ View enrolled courses in dashboard
- ✅ See AI recommendations
- ✅ View course lessons
- ❌ Cannot create/edit courses

### 👨‍🏫 Instructor

- ✅ Everything a Student can do
- ✅ Create courses
- ✅ Edit own courses
- ✅ Delete own courses
- ✅ Add/edit/delete lessons in own courses
- ❌ Cannot edit other instructors' courses

### 👨‍💼 Admin

- ✅ Everything an Instructor can do
- ✅ Edit any course
- ✅ Delete any course
- ✅ Full system access

---

## 🔍 Navigation Tips

- **Navbar**: Always visible at the top

  - Shows your name when logged in
  - Quick links to Dashboard, Courses
  - Create Course button (Instructors/Admins)
  - Logout button

- **Footer**: Always visible at the bottom

  - Quick links
  - Developer information
  - Copyright notice

- **Back Navigation**:
  - Browser back button works
  - "Back to Courses" links on detail pages
  - "Cancel" buttons on forms

---

## 🚀 Quick Start Checklist

1. ✅ Run `npm run dev`
2. ✅ Visit `localhost:3000`
3. ✅ Register a new account (try different roles!)
4. ✅ Explore the dashboard
5. ✅ Browse courses
6. ✅ If Instructor/Admin: Create a course
7. ✅ Add lessons to your course
8. ✅ Test enrollment (as Student)
9. ✅ Check AI recommendations
10. ✅ Test search and filters

---

## 💡 Pro Tips

- **Multiple Accounts**: Create accounts with different roles to test all features
- **AI Recommendations**: Enroll in a few courses first to get better recommendations
- **Course Images**: Use image URLs from Unsplash or similar for course covers
- **Video Links**: Use YouTube/Vimeo links for lesson videos
- **Progress Tracking**: Enrollment progress is tracked (currently shows 0%, can be enhanced)

---

Enjoy exploring your Course Management System! 🎓
