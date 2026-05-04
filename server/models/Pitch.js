const mongoose = require("mongoose");


const PitchSchema = mongoose.Schema(
    {
        "title": String,
        "description": String,
        "industry": String,
        "ai_score": Number,
        "ai_feedback": String,
        "reviewed": Boolean,
        "status" : String,
        "mentor_feedback" : String,
        "rating" : Number,
        "student_name": String
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model("pitches", PitchSchema);