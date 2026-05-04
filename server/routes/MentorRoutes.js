const express = require("express")
const router = express.Router();

const { fieldsValidationforUser, GenrateToken } = require("../middleware/utilityMiddleware");
const { ExistMentor , registerMentor , validMentor , validToken } = require("../middleware/MentoMiddleware")


router.post("/auth/signup" , fieldsValidationforUser , ExistMentor , registerMentor);
router.post("/auth/login" , validMentor , GenrateToken );



router.get('/profile/:userId' , validToken , getMentorProfile);
router.get('/analytics' , validToken , getAnalyticsOfMentor);
router.post('/update-status' , validToken , updateStatusForPitch);
app.get('/all-pitches' , validToken , getAllPitches );



module.exports = router;
