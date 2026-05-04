const express = require("express")
const router = express.Router();

const { fieldsValidationforUser, GenrateToken } = require("../middleware/utilityMiddleware");
const {
    ExistMentor,
    RegisterMentor,
    validMentor,
    validToken,
    getMentorProfile,
    getAnalyticsOfMentor,
    updateStatusForPitch,
    getAllPitches,
    updateMentorProfile,
    uploadMentorPhoto
} = require("../middleware/MentoMiddleware");

const upload = require("../middleware/uploadMiddleware");


router.post("/auth/signup", fieldsValidationforUser, ExistMentor, RegisterMentor);
router.post("/auth/login", validMentor, GenrateToken);



router.get('/profile/:userId', validToken, getMentorProfile);
router.put('/profile', validToken, updateMentorProfile);
router.post('/upload', validToken, upload.single('photo'), uploadMentorPhoto);
router.get('/analytics', validToken, getAnalyticsOfMentor);
router.post('/update-status', validToken, updateStatusForPitch);
router.get('/all-pitches', validToken, getAllPitches);



module.exports = router;
