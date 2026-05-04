const studentModel = require("../models/Student")
const argon2 = require('argon2');
const { GenerateContent } = require("./ChatBotMiddleware")
const pitchModel = require("../models/Pitch")

const ExistStudent = async (req, res, next) => {
    try {

        const user = req.body;

        let exist = await studentModel.findOne({ "email": user.email });

        if (exist) throw new Error("student is already present in Database ");

        next();

    } catch (error) {
        console.log("signup request not completed " + error.messsage);

        res.status(400).json({
            "message": "student is already registered with this email"
        })

    }

}


const RegisterStudent = async (req, res) => {
    try {

        const user = req.body;
        const hash_password = await argon2.hash(user.password);

        const new_user = new studentModel({
            "email": user.email,
            "password": hash_password
        })

        await new_user.save();

        res.status(200).json({
            "message": "Student registered Successfully",
            "success": true
        })

    } catch (error) {
        console.log("line 44 ", error.message);

        res.status(400).json({
            "message": "something went wrong"
        })
    }
}


const ValidStudent = async (req, res, next) => {

    try {

        const user = req.body;

        if (!user) throw new Error("user not found for login");

        const exist = await studentModel.findOne({ "email": user.email });

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


const ValidToken = (req , res , next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];

        if(!token) throw new Error("unauthorized user please login first");

        const encoded  = jwt.verify(token , process.env.JWT_SECRET);

        let exist = await studentModel.findOne({ "_id" : encoded._id });

        if(!exist) throw new Error("invalid Student , student not present in DB");

        req.userId = exist._id;

        next();

    } catch (error) {
        console.log("token validation failed || msg: ",error.message);

        res.status(403).json({
            "success" : false,
            "message" : "invalid token please login first"
        })

    }

}


const SavePitch = async (req , res)=>{

    try {
        
        const pitch = req.body;
        if(!pitch) throw new Error("pitch data not found");
        const genContent = GenerateContent(pitch.description);

        const new_pitch = new pitchModel({
            "title" : pitch.title,
            "description" : pitch.description,
            "industry" : pitch.industry,
            "ai_score" : genContent.score,
            "ai_feedback" : genContent.feedback,
            "reviewed" : false
        })

        let saved_pitch = await new_pitch.save();

        await studentModel.updateOne( { "_id" : req.userId } , {
            $push : {
                "submittedPitches" : saved_pitch._id
            }
        })

        res.status(200).json({
            "success" : true,
            "messgae" : "pitch created successfully"
        })


    } catch (error) {
        console.log("unable to save pitch")
    }

}


const getPitches = async (req ,res )=>{
    try {
        
        const userId = req.userId;

        const pitches = await studentModel.findOne({ "_id" : userId } , { "submittedPitches" : 1 }).populate('pitches');

        res.status(200).json({
            "status" : true,
            "pitches" : pitches
        })

    } catch (error) {
        console.log(error.message);
        
        res.status(400).json({
            "message" : "something went wrong unable to get pitches"
        })
    }
}


const getStudentProfile = async ( req , res )=>{
    try {
        
        const user = await studentModel.findOne({ "_id" : req.userId }).lean();

        const { password , submittedPitches , ...filteredUser } = user;

        res.status(200).json({
            "success" : true,
            "user" : filteredUser
        })

    } catch (error) {
        console.log(error.message);

        res.json(403).json({
            "message" : "unable to fetch student profile",
            "success" : false
        })
    }
}

module.exports = { ExistStudent, RegisterStudent, ValidStudent, ValidToken , SavePitch , getPitches , getStudentProfile };