const MentorModel = require("../models/Mentor")
const argon2 = require("argon2")

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


const validToken = (req, res, next) => {
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

module.exports = { ExistMentor, RegisterMentor, validMentor, validToken, getAnalyticsOfMentor }