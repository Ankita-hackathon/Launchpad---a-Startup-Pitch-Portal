const express = require("express");
const router = express.Router();

const { fieldsValidationforUser, GenrateToken } = require("../middleware/utilityMiddleware")
const { ExistStudent,
        RegisterStudent,
        ValidStudent,
        ValidToken,
        SavePitch,
        getPitches,
        getStudentProfile,
        updateStudentProfile,
        uploadStudentPhoto
} = require("../middleware/StudentMiddleware");

const upload = require("../middleware/uploadMiddleware");


router.post("/auth/signup", fieldsValidationforUser, ExistStudent, RegisterStudent);
router.post("/auth/login", ValidStudent, GenrateToken);

router.post("/pitch", ValidToken, SavePitch);
router.get("/my-pitches", ValidToken, getPitches);
router.get('/profile', ValidToken, getStudentProfile);
router.put('/profile', ValidToken, updateStudentProfile);
router.post('/upload', ValidToken, upload.single('photo'), uploadStudentPhoto);

module.exports = router;
