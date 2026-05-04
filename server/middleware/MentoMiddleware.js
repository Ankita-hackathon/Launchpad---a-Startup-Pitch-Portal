const MentorModel = require("../models/Mentor")
const pitchModel = require("../models/Pitch")
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")

const ExistMentor = async (req, res, next) => {
    try {

        const user = req.body;

        let exist = await MentorModel.findOne({ "email": user.email });

        if (exist) throw new Error("Mentor is already present in Database ");

        next();

    } catch (error) {
        console.log("signup request not completed " + error.messsage);

        res.status(400).json({
            "message": "Mentor is already registered with this email"
        })

    }

}

const RegisterMentor = async (req, res) => {
    try {

        const user = req.body;
        const hash_password = await argon2.hash(user.password);

        const new_user = new MentorModel({
            "name": user.name,
            "email": user.email,
            "password": hash_password
        })

        await new_user.save();

        res.status(200).json({
            "message": "Mentor registered Successfully",
            "success": true
        })

    } catch (error) {
        console.log("line 44 ", error.message);

        res.status(400).json({
            "message": "something went wrong"
        })
    }
}

const validMentor = async (req, res, next) => {

    try {

        const user = req.body;

        if (!user) throw new Error("mentor not found for login");

        const exist = await MentorModel.findOne({ "email": user.email });

        if (!exist) throw new Error("invalid credentials for login");

        req.userId = exist._id;

        let checkPassword = await argon2.verify(exist.password, user.password);

        if (!checkPassword) throw new Error("Password does not match for the user please provide valid password");

        // all clear

        next();

    } catch (error) {
        console.log(error.message);

        res.status(400).json({
            "message": "login failed please provide valid credentials"
        })
    }

}


const validToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) throw new Error("unauthorized user please login first");

        const encoded = jwt.verify(token, process.env.JWT_SECRET);

        let exist = await MentorModel.findOne({ "_id": encoded._id });

        if (!exist) throw new Error("invalid Mentor , Mentor not present in DB");

        req.userId = exist._id;

        next();

    } catch (error) {
        console.log("token validation failed || msg: ", error.message);

        res.status(403).json({
            "success": false,
            "message": "invalid token please login first"
        })

    }

}

const getAnalyticsOfMentor = async (req, res) => {
    try {
        const analytics = await pitchModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    approved: {
                        $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
                    },
                    rejected: {
                        $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
                    },
                    avgScore: { $avg: "$ai_score" }
                }
            },
            {
                $project: {
                    _id: 0, // Remove the internal _id from the final output
                    total: 1,
                    approved: 1,
                    rejected: 1,
                    // ROUND(AVG(ai_score), 2)
                    avgScore: { $round: ["$avgScore", 2] }
                }
            }
        ]);

        const result = analytics.length > 0
            ? analytics[0]
            : { total: 0, approved: 0, rejected: 0, avgScore: 0 };

        res.status(200).json(result);

    } catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({ message: "DB error", error: error.message });
    }
};

const getMentorProfile = async (req , res)=>{
    try{
        const userId = req.userId;
        const mentor = await MentorModel.findById(userId);
        if(!mentor) throw new Error("Mentor not found");
        res.status(200).json(mentor);
    }catch(error){
        console.log(error.message);
        res.status(400).json({
            "message": "something went wrong"
        })
    }
}

const updateStatusForPitch = async (req , res)=>{

    try{
         const { pitchId, status, feedback, rating } = req.body;

        if(!pitchId || !status) throw new Error("Invalid request ");

        await pitchModel.updateOne({ "_id" : pitchId }, {
            $set : {
                status : status,
                mentor_feedback : feedback,
                rating : rating
            }
        })
        
        res.status(200).json({
            "success" : true,
            "message" : "pitch response updated successfully"
        })

    }catch(error){
        console.log(error.message);

        res.status(400).json({
            "success" : false,
            "message" : "something went wrong while updating the pitch"
        })

    }
}

const getAllPitches = async (req , res)=>{
    try{
        const pitches = await pitchModel.find();
        res.status(200).json(pitches);
    }catch(error){
        console.log(error.message);
        res.status(400).json({
            "message": "something went wrong while fetching the pitches"
        })
    }
}

const updateMentorProfile = async (req, res) => {
    try {
        const { name, experties } = req.body;
        
        let expertiesArray = experties;
        if (typeof experties === 'string') {
            expertiesArray = experties.split(',').map(e => e.trim()).filter(e => e !== "");
        }

        await MentorModel.updateOne(
            { _id: req.userId },
            { $set: { name, experties: expertiesArray } }
        );
        res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
}

const uploadMentorPhoto = async (req, res) => {
    try {
        if (!req.file) throw new Error("No file uploaded");
        const imageUrl = req.file.path; 
        
        await MentorModel.updateOne(
            { _id: req.userId },
            { $set: { imagelink: imageUrl } }
        );

        res.status(200).json({ success: true, photo: imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to upload photo" });
    }
}

module.exports = { ExistMentor, RegisterMentor, validMentor, validToken, getAnalyticsOfMentor , getMentorProfile , updateStatusForPitch , getAllPitches, updateMentorProfile, uploadMentorPhoto }