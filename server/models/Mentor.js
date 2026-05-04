const { mongoose } = require('mongoose');


const MentorSchema = mongoose.Schema(
    {
        "name": String,
        "email": String,
        "password": String,
        "experties": [String],
        "imagelink": String,
        "reviewedpitches": [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'pitches'
            }
        ]
    },
    { timestamps: true }
)



module.exports = mongoose.model("mentors", MentorSchema);
