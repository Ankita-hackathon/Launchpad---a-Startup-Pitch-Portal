require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const MongoDB = require("./middleware/connection")
const app = express();

const MentorRoutes = require('./routes/MentorRoutes');
const StudentRoutes = require('./routes/studentRoutes')


//mongo connetion
MongoDB();




app.use(cors());
app.use(express.json());

// ================= AI =================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ================= DB =================
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});




// ================= HEALTH CHECK =================
app.get('/api/health', (req, res) => {
    res.json({ status: "Backend running 🚀" });
});


app.use("/api/ai" , );
app.use("/api/pitch" , );
app.use("/api/mentor" , MentorRoutes);
app.use("/api/student" , StudentRoutes);


// ================= AUTH =================
// app.post('/api/auth/register', (req, res) => {
//     const { name, email, password, role } = req.body;

//     console.log(req.body);

//     db.query(
//         "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
//         [name, email, password, role],
//         (err) => {
//             if (err) {
//                 console.error("Register error:", err);
//                 return res.status(500).json({ message: "Email already exists" });
//             }
//             res.json({ success: true });
//         }
//     );
// });

// app.post('/api/auth/login', (req, res) => {
//     const { email, password, role } = req.body;

//     db.query(
//         "SELECT * FROM users WHERE email=? AND password=?",
//         [email, password],
//         (err, rows) => {
//             if (err || !rows.length)
//                 return res.status(401).json({ message: "Invalid credentials" });

//             if (rows[0].role !== role)
//                 return res.status(403).json({ message: "Wrong role selected" });

//             res.json({ success: true, user: rows[0] });
//         }
//     );
// });

// // ================= AI CHAT =================
// app.post('/api/ai/chat', async (req, res) => {
//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
//         const result = await model.generateContent(req.body.message);
//         res.json({ reply: result.response.text() });
//     } catch (err) {
//         console.error("AI chat error:", err);
//         res.status(500).json({ reply: "AI temporarily unavailable" });
//     }
// });

// // ================= PITCH ANALYSIS =================
// app.post('/api/pitch/analyze', async (req, res) => {
//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
//         const prompt = `Analyze this startup pitch and give feedback:\n${req.body.description}`;
//         const result = await model.generateContent(prompt);

//         const score = Math.floor(Math.random() * 25) + 70;

//         db.query(
//             `INSERT INTO pitches
//             (user_id,title,description,industry,ai_score,ai_feedback)
//             VALUES (?,?,?,?,?,?)`,
//             [
//                 req.body.userId,
//                 req.body.title,
//                 req.body.description,
//                 req.body.industry,
//                 score,
//                 result.response.text()
//             ],
//             (err) => {
//                 if (err) {
//                     console.error("Pitch insert error:", err);
//                     return res.status(500).json({ message: "DB insert failed" });
//                 }

//                 res.json({ score, feedback: result.response.text() });
//             }
//         );
//     } catch (err) {
//         console.error("Pitch AI error:", err);
//         res.status(500).json({ message: "AI analysis failed" });
//     }
// });

// // ================= MENTOR: VIEW ALL PITCHES =================
// app.get('/api/mentor/all-pitches', (req, res) => {
//     db.query(
//         `SELECT p.*, u.name AS student_name
//          FROM pitches p
//          JOIN users u ON p.user_id = u.id
//          ORDER BY p.created_at DESC`,
//         (err, rows) => {
//             if (err) {
//                 console.error("Fetch pitches error:", err);
//                 return res.status(500).json({ message: "DB error" });
//             }
//             res.json(rows);
//         }
//     );
// });

// // ================= MENTOR: REVIEW PITCH =================
// app.post('/api/mentor/update-status', (req, res) => {
//     const { pitchId, status, feedback, rating } = req.body;
//     const mentorRating = rating ? Number(rating) : null;

//     db.query(
//         `UPDATE pitches
//          SET status=?,
//              mentor_feedback=?,
//              mentor_rating=?,
//              reviewed_at=NOW()
//          WHERE id=?`,
//         [status, feedback, mentorRating, pitchId],
//         (err) => {
//             if (err) {
//                 console.error("Mentor update error:", err);
//                 return res.status(500).json({ message: "Update failed" });
//             }

//             // 🔔 notification
//             db.query(
//                 `INSERT INTO notifications (user_id, pitch_id, message)
//                  SELECT user_id, id, ?
//                  FROM pitches WHERE id=?`,
//                 [`Your pitch has been ${status} by mentor`, pitchId],
//                 (notifyErr) => {
//                     if (notifyErr) {
//                         console.error("Notification error:", notifyErr);
//                     }
//                 }
//             );

//             res.json({ success: true });
//         }
//     );
// });

// // ================= STUDENT: VIEW THEIR PITCHES =================
// app.get('/api/student/my-pitches/:userId', (req, res) => {
//     db.query(
//         `SELECT title, status, mentor_feedback, mentor_rating, reviewed_at
//          FROM pitches
//          WHERE user_id=?
//          ORDER BY created_at DESC`,
//         [req.params.userId],
//         (err, rows) => {
//             if (err) {
//                 console.error("Student pitches error:", err);
//                 return res.status(500).json({ message: "DB error" });
//             }
//             res.json(rows);
//         }
//     );
// });

// // ================= STUDENT: NOTIFICATIONS =================
// app.get('/api/student/notifications/:userId', (req, res) => {
//     db.query(
//         `SELECT * FROM notifications
//          WHERE user_id=?
//          ORDER BY created_at DESC`,
//         [req.params.userId],
//         (err, rows) => {
//             if (err) {
//                 console.error("Notifications error:", err);
//                 return res.status(500).json({ message: "DB error" });
//             }
//             res.json(rows);
//         }
//     );
// });

// // ================= MENTOR ANALYTICS =================
// app.get('/api/mentor/analytics', (req, res) => {
//     db.query(
//         `SELECT
//             COUNT(*) AS total,
//             SUM(status='approved') AS approved,
//             SUM(status='rejected') AS rejected,
//             ROUND(AVG(ai_score),2) AS avgScore
//          FROM pitches`,
//         (err, rows) => {
//             if (err) {
//                 console.error("Analytics error:", err);
//                 return res.status(500).json({ message: "DB error" });
//             }
//             res.json(rows[0]);
//         }
//     );
// });

// // ================= STUDENT PROFILE =================
// app.get('/api/student/profile/:userId', (req, res) => {
//     const userId = req.params.userId;

//     db.query(
//         `
//         SELECT
//             u.name,
//             u.email,
//             COUNT(p.id) AS totalPitches,
//             SUM(p.status='approved') AS approved,
//             SUM(p.status='rejected') AS rejected,
//             ROUND(AVG(p.mentor_rating), 1) AS avgRating
//         FROM users u
//         LEFT JOIN pitches p ON u.id = p.user_id
//         WHERE u.id = ?
//         `,
//         [userId],
//         (err, rows) => {
//             if (err) return res.status(500).json({ message: "DB Error" });
//             res.json(rows[0]);
//         }
//     );
// });

// // ================= MENTOR PROFILE =================
// app.get('/api/mentor/profile/:userId', (req, res) => {
//     const userId = req.params.userId;

//     db.query(
//         `
//         SELECT
//             u.name,
//             u.email,
//             COUNT(p.id) AS reviewed,
//             SUM(p.status='approved') AS approved,
//             SUM(p.status='rejected') AS rejected,
//             ROUND(AVG(p.mentor_rating),1) AS avgRating
//         FROM users u
//         LEFT JOIN pitches p ON p.reviewed_at IS NOT NULL
//         WHERE u.id = ?
//         `,
//         [userId],
//         (err, rows) => {
//             if (err) return res.status(500).json({ message: "DB Error" });
//             res.json(rows[0]);
//         }
//     );
// });


// ================= SERVER =================
app.listen(process.env.PORT, () =>
    console.log(`🚀 Server running on port ${process.env.PORT}`)
);
