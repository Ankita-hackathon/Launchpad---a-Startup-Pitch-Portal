const express = require("express");
const router = express.Router();

const { fieldsValidationforUser , GenrateToken } = require("../middleware/utilityMiddleware")
const { ExistStudent , RegisterStudent , ValidStudent  , ValidToken , SavePitch , getPitches , getStudentProfile } = require("../middleware/StudentMiddleware")


router.post("/auth/signup" , fieldsValidationforUser , ExistStudent , RegisterStudent);
router.post("/auth/login" , ValidStudent , GenrateToken);

router.post("/api/pitch" , ValidToken , SavePitch);
router.get("/my-pitches/:userId" , ValidToken , getPitches);
router.get('/profile/:userId' , ValidToken , getStudentProfile);


module.exports = router;
