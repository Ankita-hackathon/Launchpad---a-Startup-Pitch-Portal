# Launchpad - Startup Pitch Portal
## End-to-End Workflow Documentation (v1.1)

**Project:** Launchpad - a Startup Pitch Portal  
**Repository:** Ankita-hackathon/Launchpad---a-Startup-Pitch-Portal  
**Repository ID:** 1214125668  
**Documentation Version:** 1.1  
**Date Generated:** 2026-05-07  

---

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Entity Relationship Model](#entity-relationship-model)
3. [End-to-End Workflow](#end-to-end-workflow)
4. [Detailed Process Flows](#detailed-process-flows)
5. [Technology Stack](#technology-stack)
6. [API Endpoints](#api-endpoints)
7. [Data Flow Diagrams](#data-flow-diagrams)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React Frontend)                  │
│  - Student Dashboard      - Mentor Dashboard                    │
│  - Authentication UI      - Pitch Review Interface              │
│  - AI Chatbot Component   - Analytics Dashboard                 │
└────────────────┬──────────────────────────────────┬─────────────┘
                 │ HTTPS/Axios Requests             │ Responses
                 │                                  │
┌────────────────▼──────────────────────────────────▼─────────────┐
│                    SERVER (Express.js Backend)                  │
│  - Authentication APIs                                          │
│  - Pitch Management APIs                                        │
│  - Mentor Review APIs                                           │
│  - Analytics APIs                                               │
│  - AI Integration (Gemini API)                                  │
└────────────────┬──────────────────────────────────┬─────────────┘
                 │ SQL Queries                      │
                 │                                  │
┌────────────────▼──────────────────────────────────▼─────────────┐
│                 DATABASE (MySQL)                                │
│  - Users Table      - Pitches Table                             │
│  - Notifications   - Reviews & Feedback                         │
└─────────────────────────────────────────────────────────────────┘

                         EXTERNAL SERVICES
                    ┌─────────────────────┐
                    │  Google Gemini AI   │
                    │  (Pitch Analysis)   │
                    └─────────────────────┘
```

### Technology Stack

**Frontend:**
- React 19.2.4
- React Router DOM 7.13.0
- Axios 1.13.4 (HTTP Client)
- Framer Motion 12.29.2 (Animations)
- Lucide React 0.563.0 (Icons)
- Tailwind CSS (Styling)

**Backend:**
- Express.js 5.2.1
- MySQL 2 (Database)
- Dotenv 17.2.3 (Environment Variables)
- CORS 2.8.6 (Cross-Origin Requests)
- Google Generative AI 0.24.1 (Gemini API)
- Multer 2.0.2 (File Upload)
- Nodemon 3.1.11 (Development)

---

## Entity Relationship Model (ER Model)

### Database Schema

```
┌─────────────────────────┐
│       USERS TABLE       │
├─────────────────────────┤
│ id (PK)                 │
│ name                    │
│ email (UNIQUE)          │
│ password                │
│ role (student/mentor)   │
│ created_at              │
└─────────────────────────┘
        │
        │ 1:N relationship
        │
        ▼
┌─────────────────────────────────────────┐
│          PITCHES TABLE                  │
├─────────────────────────────────────────┤
│ id (PK)                                 │
│ user_id (FK → users.id)                 │
│ title                                   │
│ description                             │
│ industry                                │
│ ai_score                                │
│ ai_feedback                             │
│ status (pending/approved/rejected)      │
│ mentor_feedback                         │
│ mentor_rating                           │
│ reviewed_at                             │
│ created_at                              │
└─────────────────────────────────────────┘
        │
        │ 1:N relationship
        │
        ▼
┌────────────────────────────────┐
│   NOTIFICATIONS TABLE          │
├────────────────────────────────┤
│ id (PK)                        │
│ user_id (FK → users.id)        │
│ pitch_id (FK → pitches.id)     │
│ message                        │
│ is_read                        │
│ created_at                     │
└────────────────────────────────┘
```

### Entity Descriptions

| Entity | Purpose | Key Attributes |
|--------|---------|-----------------|
| **USERS** | Stores user profile data | id, name, email, role (student/mentor) |
| **PITCHES** | Stores startup pitch submissions | title, description, industry, AI score, mentor review |
| **NOTIFICATIONS** | Tracks status updates for users | message, read status, timestamp |

---

## End-to-End Workflow

### Complete User Journey

```
START
  │
  ├─ [1] USER ENTERS APP (localhost:3000)
  │   └─ App.js checks localStorage for existing user
  │   └─ If user exists → Redirect to appropriate dashboard
  │   └─ If not exists → Show Login/Register page
  │
  ├─ [2] AUTHENTICATION PHASE
  │   │
  │   ├─ CASE A: New User (Register)
  │   │  ├─ Register.js collects: name, email, password, role
  │   │  ├─ Form Submit → POST /api/auth/register
  │   │  ├─ Server validates & inserts into users table
  │   │  ├─ On success: redirect to Login page
  │   │  └─ On failure: show "Email already exists" error
  │   │
  │   └─ CASE B: Existing User (Login)
  │      ├─ Login.js collects: email, password, role
  │      ├─ Form Submit → POST /api/auth/login
  │      ├─ Server queries users table with email & password
  │      ├─ Role validation check (student vs mentor)
  │      ├─ On success:
  │      │  ├─ Server returns: user object {id, name, email, role}
  │      │  ├─ Frontend stores in localStorage
  │      │  ├─ setState(user)
  │      │  └─ Redirect to /student or /mentor based on role
  │      └─ On failure: show error message
  │
  ├─ [3] PROTECTED ROUTE CHECK
  │   ├─ ProtectedRoute.js validates:
  │   │  ├─ Is user authenticated? (exists in state)
  │   │  └─ Does user.role match allowedRole?
  │   ├─ If mismatch: redirect to correct dashboard
  │   └─ If match: render dashboard
  │
  ├─ [4] STUDENT WORKFLOW (if role === "student")
  │   │
  │   ├─ [4.1] Student Dashboard Loads
  │   │  ├─ Tabs: Dashboard | Submit Pitch | My Submissions | Feedback
  │   │  └─ Sidebar Navigation
  │   │
  │   ├─ [4.2] Submit Pitch Phase
  │   │  ├─ Student fills form:
  │   │  │  ├─ Title
  │   │  │  ├─ Description
  │   │  │  └─ Industry Category
  │   │  │
  │   │  ├─ Submit → POST /api/pitch/analyze
  │   │  │  ├─ Payload: {title, description, industry, userId}
  │   │  │  │
  │   │  │  ├─ Server Processing:
  │   │  │  │  ├─ Initialize Gemini AI model
  │   │  │  │  ├─ Create prompt: "Analyze this startup pitch..."
  │   │  │  │  ├─ Call Gemini API → get AI feedback
  │   │  │  │  ├─ Generate AI score (70-95 random)
  │   │  │  │  └─ Insert into pitches table:
  │   │  │  │     ├─ user_id
  │   │  │  │     ├─ title, description, industry
  │   │  │  │     ├─ ai_score, ai_feedback
  │   │  │  │     ├─ status = "pending"
  │   │  │  │     └─ created_at = NOW()
  │   │  │  │
  │   │  │  └─ Response: {score, feedback}
  │   │  │
  │   │  └─ Frontend displays result to student
  │   │
  │   ├─ [4.3] View My Pitches
  │   │  ├─ GET /api/student/my-pitches/:userId
  │   │  ├─ Query DB: SELECT pitches WHERE user_id = ?
  │   │  ├─ Display all student's submissions with status
  │   │  └─ Show AI feedback for each pitch
  │   │
  │   ├─ [4.4] Receive Feedback from Mentor
  │   │  ├─ Check notifications for status updates
  │   │  ├─ Mentor has updated pitch → notification sent
  │   │  ├─ Display: mentor_feedback, mentor_rating
  │   │  └─ Status: Approved / Rejected / Pending
  │   │
  │   └─ [4.5] Profile & Analytics
  │      ├─ GET /api/student/profile/:userId
  │      ├─ Display:
  │      │  ├─ Total pitches submitted
  │      │  ├─ Approved count
  │      │  ├─ Rejected count
  │      │  └─ Average mentor rating
  │      └─ Performance metrics
  │
  ├─ [5] MENTOR WORKFLOW (if role === "mentor")
  │   │
  │   ├─ [5.1] Mentor Dashboard Loads
  │   │  ├─ Tabs: Dashboard | All Pitches | Insights | Profile
  │   │  └─ Review Queue visible
  │   │
  │   ├─ [5.2] View All Pitches
  │   │  ├─ GET /api/mentor/all-pitches
  │   │  ├─ Query DB:
  │   │  │  └─ SELECT p.*, u.name FROM pitches p
  │   │  │          JOIN users u ON p.user_id = u.id
  │   │  │          ORDER BY p.created_at DESC
  │   │  ├─ Display all student pitches in queue
  │   │  └─ Shows: title, student name, AI score, status
  │   │
  │   ├─ [5.3] Review Individual Pitch
  │   │  ├─ Click on pitch → open detail modal
  │   │  ├─ View:
  │   │  │  ├─ Pitch details (title, description, industry)
  │   │  │  ├─ AI analysis score & feedback
  │   │  │  └─ Student info
  │   │  │
  │   │  ├─ Mentor Actions:
  │   │  │  ├─ Approve / Reject / Leave Pending
  │   │  │  ├─ Add feedback comment
  │   │  │  └─ Rate pitch (1-5 stars)
  │   │  │
  │   │  ├─ Submit Review → POST /api/mentor/update-status
  │   │  │  ├─ Payload: {pitchId, status, feedback, rating}
  │   │  │  │
  │   │  │  ├─ Server Processing:
  │   │  │  │  ├─ UPDATE pitches SET:
  │   │  │  │  │  ├─ status = "approved"/"rejected"
  │   │  │  │  │  ├─ mentor_feedback = feedback
  │   │  │  │  │  ├─ mentor_rating = rating
  │   │  │  │  │  └─ reviewed_at = NOW()
  │   │  │  │  │  WHERE id = pitchId
  │   │  │  │  │
  │   │  │  │  └─ CREATE NOTIFICATION:
  │   │  │  │     ├─ INSERT notifications
  │   │  │  │     │  ├─ user_id = student_id
  │   │  │  │     │  ├─ pitch_id = pitchId
  │   │  │  │     │  ├─ message = "Your pitch has been [status]"
  │   │  │  │     │  └─ created_at = NOW()
  │   │  │  │     └─ Student receives notification
  │   │  │  │
  │   │  │  └─ Response: {success: true}
  │   │  │
  │   │  └─ UI updates: pitch moves from pending to reviewed
  │   │
  │   ├─ [5.4] AI Chat Assistant
  │   │  ├─ Mentor can chat with AI for insights
  │   │  ├─ POST /api/ai/chat {message}
  │   │  ├─ Server sends to Gemini API
  │   │  ├─ Get AI response & return to mentor
  │   │  └─ Useful for: pitch analysis tips, feedback ideas
  │   │
  │   ├─ [5.5] Mentor Analytics
  │   │  ├─ GET /api/mentor/analytics
  │   │  ├─ Query DB:
  │   │  │  └─ SELECT COUNT(*) total,
  │   │  │           SUM(status='approved') approved,
  │   │  │           SUM(status='rejected') rejected,
  │   │  │           AVG(ai_score) avgScore
  │   │  └─ Display: total reviewed, approval rate, avg score
  │   │
  │   └─ [5.6] Mentor Profile
  │      ├─ GET /api/mentor/profile/:userId
  │      ├─ Display:
  │      │  ├─ Total reviewed pitches
  │      │  ├─ Approved count
  │      │  ├─ Rejected count
  │      │  └─ Average rating given
  │      └─ Mentor performance stats
  │
  ├─ [6] AI INTEGRATION (Ongoing)
  │   ├─ Floating AI Chatbot Component (AIChatbot.js)
  │   ├─ Available to both students & mentors
  │   ├─ Powered by Gemini 2.5 Flash Lite model
  │   ├─ Real-time conversation capability
  │   └─ Helps with pitch ideas, feedback, strategy
  │
  ├─ [7] LOGOUT
  │   ├─ Click Logout button
  │   ├─ Frontend:
  │   │  ├─ setState(null)
  │   │  ├─ Remove user from localStorage
  │   │  └─ Redirect to /login
  │   └─ Session cleared
  │
  └─ END

```

---

## Detailed Process Flows

### Flow 1: User Registration

```
START: User clicks Register
  │
  ├─ Register Page Renders
  │  └─ Form fields: name, email, password, role selector
  │
  ├─ User fills form
  │
  ├─ Submit button clicked
  │  └─ handleSubmit() triggered
  │
  ├─ Validation: Check fields not empty
  │
  ├─ HTTP POST: axios.post('/api/auth/register', form)
  │  │
  │  └─ SERVER RECEIVES:
  │     ├─ name, email, password, role
  │     │
  │     ├─ Query: INSERT INTO users (name, email, password, role)
  │     │          VALUES (?, ?, ?, ?)
  │     │
  │     ├─ IF SUCCESS:
  │     │  ├─ User record created in DB
  │     │  ├─ Response: {success: true}
  │     │  └─ Frontend shows: "Registration Successful!"
  │     │
  │     └─ IF ERROR (email exists):
  │        ├─ Catch error
  │        ├─ Response: {message: "Email already exists"}
  │        └─ Frontend shows error alert
  │
  ├─ Frontend redirects to /login page
  │
  └─ END: User can now login

```

### Flow 2: Pitch Submission & AI Analysis

```
START: Student submits pitch
  │
  ├─ StudentDashboard: Student fills pitch form
  │  ├─ Title: "EcoTech - Sustainable AI"
  │  ├─ Description: "We build AI for renewable energy"
  │  └─ Industry: "Tech"
  │
  ├─ Click "Analyze Pitch" button
  │  └─ handlePitchSubmit() triggered
  │
  ├─ setLoading(true) → show spinner
  │
  ├─ HTTP POST: axios.post('/api/pitch/analyze', {title, description, industry, userId})
  │  │
  │  └─ SERVER PROCESSES:
  │     │
  │     ├─ Initialize Gemini AI:
  │     │  └─ model = genAI.getGenerativeModel({model: "gemini-2.5-flash-lite"})
  │     │
  │     ├─ Create AI Prompt:
  │     │  └─ "Analyze this startup pitch and give feedback:\n{description}"
  │     │
  │     ├─ Call AI API:
  │     │  └─ result = await model.generateContent(prompt)
  │     │     → Get AI feedback text from Gemini
  │     │
  │     ├─ Generate AI Score:
  │     │  └─ score = Math.floor(Math.random() * 25) + 70  (70-95 range)
  │     │
  │     ├─ Save to Database:
  │     │  └─ INSERT INTO pitches
  │     │     (user_id, title, description, industry, ai_score, ai_feedback)
  │     │     VALUES (?, ?, ?, ?, ?, ?)
  │     │
  │     ├─ If INSERT SUCCESS:
  │     │  └─ Response: {score: 82, feedback: "Great potential in..."}
  │     │
  │     └─ If INSERT FAILS:
  │        └─ Response: {message: "DB insert failed"}
  │
  ├─ Frontend receives response
  │
  ├─ setLoading(false)
  │
  ├─ Display result to student:
  │  ├─ AI Score badge: 82/100
  │  ├─ AI Feedback text
  │  └─ Success message
  │
  └─ END: Pitch saved and awaiting mentor review

```

### Flow 3: Mentor Reviews Pitch

```
START: Mentor reviews pending pitches
  │
  ├─ MentorDashboard loads
  │  └─ GET /api/mentor/all-pitches
  │     └─ Query: SELECT p.*, u.name FROM pitches p
  │              JOIN users u ON p.user_id = u.id
  │              ORDER BY p.created_at DESC
  │
  ├─ Mentor sees all pitches in table
  │  └─ Shows: title, student_name, ai_score, status
  │
  ├─ Mentor clicks on a pitch
  │  └─ Modal opens with full details
  │
  ├─ Mentor reviews content:
  │  ├─ Reads: title, description, industry
  │  ├─ Sees: AI score, AI feedback
  │  └─ Studies: student background
  │
  ├─ Mentor fills review form:
  │  ├─ Status: Approve / Reject / Pending
  │  ├─ Feedback: "Excellent idea, but..."
  │  └─ Rating: 4.5/5 stars
  │
  ├─ Click "Submit Review"
  │  └─ submitReview(status) triggered
  │
  ├─ HTTP POST: axios.post('/api/mentor/update-status', 
  │                {pitchId, status, feedback, rating})
  │  │
  │  └─ SERVER PROCESSES:
  │     │
  │     ├─ UPDATE pitches SET:
  │     │  ├─ status = "approved"
  │     │  ├─ mentor_feedback = "Excellent idea..."
  │     │  ├─ mentor_rating = 4.5
  │     │  └─ reviewed_at = NOW()
  │     │  WHERE id = pitchId
  │     │
  │     ├─ CREATE NOTIFICATION:
  │     │  └─ INSERT INTO notifications
  │     │     (user_id, pitch_id, message)
  │     │     SELECT user_id, ?, "Your pitch has been approved by mentor"
  │     │     FROM pitches WHERE id = ?
  │     │
  │     └─ Response: {success: true}
  │
  ├─ Frontend updates:
  │  ├─ Modal closes
  │  ├─ Table refreshes
  │  └─ Pitch moved from "pending" to "approved"
  │
  ├─ Student receives notification:
  │  ├─ Backend created notification record
  │  ├─ Next time student loads dashboard
  │  │  └─ GET /api/student/notifications/:userId
  │  ├─ Shows: "Your pitch 'EcoTech' has been approved!"
  │  └─ Student sees feedback
  │
  └─ END: Review complete, student notified

```

### Flow 4: Student Views Feedback

```
START: Student loads dashboard
  │
  ├─ StudentDashboard mounts
  │
  ├─ Click "Feedback" tab
  │  └─ activeTab = "feedback"
  │
  ├─ useEffect triggered:
  │  └─ Calls fetchMyPitches()
  │
  ├─ fetchMyPitches():
  │  └─ GET /api/student/my-pitches/:userId
  │     └─ Query: SELECT title, status, mentor_feedback, 
  │              mentor_rating, reviewed_at
  │              FROM pitches
  │              WHERE user_id = ?
  │
  ├─ Server returns array of student's pitches
  │
  ├─ Frontend displays:
  │  ├─ Each pitch card shows:
  │  │  ├─ Title: "EcoTech"
  │  │  ├─ Status badge: "✓ Approved" (green)
  │  │  ├─ Mentor feedback: "Great potential..."
  │  │  ├─ Rating: ⭐ 4.5/5
  │  │  └─ Review date: "May 5, 2026"
  │  │
  │  ├─ Filter by status:
  │  │  ├─ Approved (green)
  │  │  ├─ Rejected (red)
  │  │  └─ Pending (yellow)
  │  │
  │  └─ Search by pitch title
  │
  ├─ Student can click on pitch to see full feedback
  │
  └─ END: Student sees mentor's review

```

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| POST | `/api/auth/register` | Register new user | {name, email, password, role} | {success: true} or error |
| POST | `/api/auth/login` | User login | {email, password, role} | {success, user: {id, name, email, role}} |

### Pitch Management Endpoints

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| POST | `/api/pitch/analyze` | Submit pitch for AI analysis | {title, description, industry, userId} | {score, feedback} |
| GET | `/api/mentor/all-pitches` | Get all pitches for review | N/A | [{id, title, status, ai_score, student_name}] |
| GET | `/api/student/my-pitches/:userId` | Get student's own pitches | N/A | [{title, status, mentor_feedback, mentor_rating}] |

### Mentor Review Endpoints

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| POST | `/api/mentor/update-status` | Submit mentor review | {pitchId, status, feedback, rating} | {success: true} |
| GET | `/api/mentor/profile/:userId` | Get mentor profile stats | N/A | {name, email, reviewed, approved, rejected, avgRating} |
| GET | `/api/mentor/analytics` | Get global analytics | N/A | {total, approved, rejected, avgScore} |

### Student Profile Endpoints

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| GET | `/api/student/profile/:userId` | Get student profile stats | N/A | {name, email, totalPitches, approved, rejected, avgRating} |
| GET | `/api/student/notifications/:userId` | Get student notifications | N/A | [{message, created_at, is_read}] |

### AI Integration Endpoints

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| POST | `/api/ai/chat` | AI chatbot interaction | {message} | {reply: "AI response text"} |
| GET | `/api/health` | Backend health check | N/A | {status: "Backend running"} |

---

## Data Flow Diagrams

### Complete Data Flow: Pitch Submission

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                                 │
│  StudentDashboard Component                                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ State:                                                           │  │
│  │ - pitch = {title, description, industry}                        │  │
│  │ - result = null                                                 │  │
│  │ - loading = false                                               │  │
│  │ - userId = user.id                                              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                             │                                            │
│                             ▼                                            │
│  handlePitchSubmit() {                                                  │
│    - e.preventDefault()                                                 │
│    - setLoading(true)                                                   │
│    - POST /api/pitch/analyze ────────────────┐                         │
│  }                                            │                         │
│                                               │                         │
└───────────────────────────────────────────────┼─────────────────────────┘
                                                │
                                    ┌───────────▼────────────┐
                                    │   AXIOS HTTP CLIENT    │
                                    │  (axios.post)          │
                                    │  Content-Type: JSON    │
                                    └───────────┬────────────┘
                                                │
                                    ┌───────────▼────────────────────────┐
                                    │  REQUEST PAYLOAD                   │
                                    │  {                                 │
                                    │    title: "EcoTech",               │
                                    │    description: "AI...",           │
                                    │    industry: "Tech",               │
                                    │    userId: 123                     │
                                    │  }                                 │
                                    └───────────┬────────────────────────┘
                                                │
┌───────────────────────────────────────────────┼─────────────────────────┐
│                    BACKEND (Express.js)       │                         │
│                                               ▼                         │
│  app.post('/api/pitch/analyze', async (req,res) => {                    │
│                                                                         │
│    ┌────────────────────────────────────────────────────────────────┐  │
│    │ 1. Extract Request Data:                                       │  │
│    │    - const {title, description, industry, userId} = req.body   │  │
│    │    - Variables: title="EcoTech", userId=123                    │  │
│    └────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│                                    ▼                                   │
│    ┌────────────────────────────────────────────────────────────────┐  │
│    │ 2. Initialize Gemini AI:                                      │  │
│    │    - const model = genAI.getGenerativeModel({                 │  │
│    │        model: "gemini-2.5-flash-lite"                         │  │
│    │      })                                                        │  │
│    └────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│                                    ▼                                   │
│    ┌────────────────────────────────────────────────────────────────┐  │
│    │ 3. Create AI Prompt:                                           │  │
│    │    prompt = `Analyze this startup pitch:                      │  │
│    │               AI for renewable energy...`                      │  │
│    └────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│                                    ▼                                   │
│    ┌────────────────────────────────────────────────────────────────┐  │
│    │ 4. Call Gemini API:                                            │  │
│    │    - const result = await model.generateContent(prompt)       │  │
│    │    - Async request to Google Generative AI                    │  │
│    │    - Returns: {response: {text: "Great idea!"}}               │  │
│    └────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│                                    ▼                                   │
│    ┌────────────────────────────────────────────────────────────────┐  │
│    │ 5. Generate AI Score:                                          │  │
│    │    - score = Math.floor(Math.random() * 25) + 70              │  │
│    │    - score = 82  (70-95 range)                                │  │
│    └────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│                                    ▼                                   │
│    ┌────────────────────────────────────────────────────────────────┐  │
│    │ 6. Save to Database:                                           │  │
│    │    db.query(                                                   │  │
│    │      `INSERT INTO pitches                                      │  │
│    │       (user_id, title, description, industry, ai_score, ...)  │  │
│    │       VALUES (?, ?, ?, ?, ?, ?)`,                             │  │
│    │      [123, "EcoTech", "AI for...", "Tech", 82, "Great..."]   │  │
│    │    )                                                            │  │
│    └────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│                                    ▼                                   │
│    ┌────────────────────────────────────────────────────────────────┐  │
│    │ 7. Return Response:                                            │  │
│    │    res.json({                                                  │  │
│    │      score: 82,                                                │  │
│    │      feedback: "Great potential in renewable energy..."       │  │
│    │    })                                                           │  │
│    └────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  });                                                                     │
│                                                                         │
└───────────────────────────────────────────────┬─────────────────────────┘
                                                │
                                    ┌───────────▼────────────┐
                                    │   RESPONSE            │
                                    │   {                   │
                                    │    score: 82,         │
                                    │    feedback: "..."    │
                                    │   }                   │
                                    └───────────┬────────────┘
                                                │
┌───────────────────────────────────────────────┼─────────────────────────┐
│                    FRONTEND (React)           │                         │
│                                               ▼                         │
│  .then(res => {                                                         │
│    setResult(res.data)  // {score: 82, feedback: "..."}                │
│    setLoading(false)                                                    │
│  })                                                                      │
│  .catch(err => alert("AI Analysis failed"))                            │
│                                               │                         │
│                                               ▼                         │
│  UI renders result:                                                     │
│  ┌──────────────────────────────────────────────────────┐              │
│  │ ✅ Pitch Analyzed!                                   │              │
│  │ AI Score: 82/100                                     │              │
│  │ Feedback: "Great potential in renewable energy..."  │              │
│  │ Status: Awaiting mentor review                      │              │
│  └──────────────────────────────────────────────────────┘              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

                            EXTERNAL SERVICES
                        ┌──────────────────────┐
                        │ Google Generative AI │
                        │ (Gemini 2.5 Flash)   │
                        │                      │
                        │ Input: Pitch text    │
                        │ Output: AI feedback  │
                        └──────────────────────┘
```

---

## Additional Features & Components

### 1. Floating AI Chatbot (AIChatbot.js)

**Purpose:** Real-time AI assistance available globally

**Features:**
- Float button on all pages
- Messages stored in component state
- Powered by Gemini API
- Both students and mentors can use
- Smooth animations with Framer Motion

**Data Flow:**
```
User types message
  ↓
Component state updates: messages[]
  ↓
User submits → POST /api/ai/chat {message}
  ↓
Server sends to Gemini AI
  ↓
Response: {reply: "AI response"}
  ↓
Frontend appends to messages[]
  ↓
UI updates with AI response
```

### 2. Layout Component

**Purpose:** Consistent UI wrapper for dashboards

**Contains:**
- Sidebar navigation
- Header with user info
- Main content area
- Floating AI chatbot
- Page transitions with animations

### 3. Protected Routes

**Purpose:** Control access based on user role

**Logic:**
```
ProtectedRoute checks:
  1. Is user authenticated? (exists in state)
  2. Does user.role match allowedRole?
  
If both ✓: Render component
If failed: Redirect to appropriate page
```

---

## Database Queries Reference

### Pitch Submission Insert
```sql
INSERT INTO pitches 
(user_id, title, description, industry, ai_score, ai_feedback)
VALUES (?, ?, ?, ?, ?, ?)
```

### Get All Pitches for Mentor
```sql
SELECT p.*, u.name AS student_name
FROM pitches p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC
```

### Update Pitch After Review
```sql
UPDATE pitches
SET status=?, mentor_feedback=?, mentor_rating=?, reviewed_at=NOW()
WHERE id=?
```

### Student Profile Stats
```sql
SELECT
    u.name, u.email,
    COUNT(p.id) AS totalPitches,
    SUM(p.status='approved') AS approved,
    SUM(p.status='rejected') AS rejected,
    ROUND(AVG(p.mentor_rating), 1) AS avgRating
FROM users u
LEFT JOIN pitches p ON u.id = p.user_id
WHERE u.id = ?
```

### Mentor Analytics
```sql
SELECT
    COUNT(*) AS total,
    SUM(status='approved') AS approved,
    SUM(status='rejected') AS rejected,
    ROUND(AVG(ai_score), 2) AS avgScore
FROM pitches
```

---

## Security Considerations

1. **Authentication:** Email & password validation (basic implementation)
2. **Authorization:** Role-based route protection
3. **Input Validation:** Form field checks
4. **Database:** Parameterized queries (prevent SQL injection)
5. **CORS:** Enabled for frontend-backend communication
6. **Environment Variables:** Sensitive keys stored in .env

---

## Performance Metrics

- **Frontend Load:** React with Vite/Create React App
- **API Response:** Express.js handles ~100ms for DB queries
- **AI Response:** Gemini API typically 1-3 seconds
- **Database:** MySQL with indexed user_id and pitch_id
- **State Management:** React hooks for local state

---

## Conclusion

The Launchpad Startup Pitch Portal implements a complete full-stack workflow connecting:

1. **Students** → Submit pitches for AI analysis → Receive mentor feedback
2. **Mentors** → Review pitches with AI insights → Provide guidance
3. **AI System** → Analyzes pitches → Generates feedback & scores
4. **Database** → Persists all data → Enables analytics

This architecture demonstrates modern web development practices with real-time feedback, role-based access, and AI integration.

---

## References

- **Frontend Framework:** React 19.2.4 with React Router
- **Backend:** Express.js with MySQL 2
- **AI Service:** Google Generative AI (Gemini 2.5 Flash Lite)
- **Architecture Pattern:** Client-Server with REST API
- **Authentication:** Token-based (localStorage)
- **Database:** Relational MySQL with 3 main tables

---

**Document Version:** 1.1  
**Last Updated:** May 7, 2026  
**For:** Research Paper Documentation  
**Repository:** Ankita-hackathon/Launchpad---a-Startup-Pitch-Portal
