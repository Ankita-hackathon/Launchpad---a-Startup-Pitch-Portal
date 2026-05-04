require('dotenv').config();
const express = require('express');
const cors = require('cors');
const MongoDB = require("./db_conn/connection")
const app = express();

const MentorRoutes = require('./routes/MentorRoutes');
const StudentRoutes = require('./routes/studentRoutes');
const AIRoutes = require('./routes/AIRoutes');


//mongo connetion
MongoDB();

app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => {
    res.json({ status: "Backend running 🚀" });
});


app.use("/api/ai", AIRoutes);
app.use("/api/mentor" , MentorRoutes);
app.use("/api/student" , StudentRoutes);






app.listen(process.env.PORT, () =>
    console.log(`🚀 Server running on port ${process.env.PORT}`)
);
