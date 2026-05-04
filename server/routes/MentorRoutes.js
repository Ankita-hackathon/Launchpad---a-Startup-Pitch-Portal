const express = require("express");
const router  = express.Router();

const { fieldsValidationforUser, GenrateToken } = require("../middleware/utilityMiddleware");
const {
    ExistMentor,
    RegisterMentor,
    validMentor,
    validToken,
    getMentorProfile,
    getAnalyticsOfMentor,
    updateStatusForPitch,
    getAllPitches
} = require("../middleware/MentoMiddleware");


// Auth
router.post("/auth/signup", fieldsValidationforUser, ExistMentor, RegisterMentor);
router.post("/auth/login",  validMentor, GenrateToken);

// Mentor routes (protected)
router.get( "/profile/:userId", validToken, getMentorProfile);
router.get( "/analytics",       validToken, getAnalyticsOfMentor);
router.post("/update-status",   validToken, updateStatusForPitch);
router.get( "/all-pitches",     validToken, getAllPitches);


module.exports = router;
