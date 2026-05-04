const { mongoose } = require("mongoose")

const studentSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    college: String,
    department: String,
    imagelink: String,
    "submittedPitches": [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pitches"
      }
    ]

  },
  { timestamps: true }
);

module.exports = mongoose.model("students", studentSchema);

