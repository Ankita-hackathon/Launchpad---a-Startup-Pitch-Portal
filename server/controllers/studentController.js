const Student = require("../models/Student");

/* GET STUDENT */
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE STUDENT */
exports.updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
