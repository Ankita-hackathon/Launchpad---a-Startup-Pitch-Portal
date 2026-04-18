const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    college: String,
    department: String,
    photo: String,
    role: {
      type: String,
      default: "student",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
