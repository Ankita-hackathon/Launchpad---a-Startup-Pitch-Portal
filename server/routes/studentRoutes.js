const express = require("express");
const router = express.Router();
const {
  getStudent,
  updateStudent,
} = require("../controllers/studentController");

router.get("/:id", getStudent);
router.put("/:id", updateStudent);

module.exports = router;
