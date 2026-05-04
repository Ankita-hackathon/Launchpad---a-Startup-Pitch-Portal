const mongoose = require("mongoose");


const PitchSchema = mongoose.Schema(
    {
        "titile": String,
        "description": String,
        "industry": String,
        "ai_score": Number,
        "ai_feedback": String,
        "reviewed": Boolean,
        "status" : String
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model("pitches", PitchSchema);