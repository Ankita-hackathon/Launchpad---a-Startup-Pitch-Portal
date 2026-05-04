const zod = require('zod');
const jwt = require("jsonwebtoken");
require("dotenv").config();


const fieldsValidation = zod.Object(
    {
        email: zod.string().email(),
        password: z.string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
            .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
            .regex(/[0-9]/, { message: "Must contain at least one number" })
    }
)

const fieldsValidationforUser = (req, res, next) => {

    const check = fieldsValidation.safeParse(req.body);

    if(!check.success){
        res.status(400).json({
            "message" : "please provide structured email and password"
        })
    }

    next();
}

const GenrateToken = ( req , res  )=>{
    try {

        const user = req.body;
        const token  = jwt.sign( { "_id": req.userId }  , process.env.JWT_SECRET , { "expiresIn" : '1h' });
        
        res.status(200).json({
            "success" : true,
            "token" : `Bearer ${token}`
        })
        
    } catch (error) {
        console.log("something went wrong while genrating token");

        res.status(400).json({
            "message" : "something went wrong"
        })

    }

}


module.exports = { fieldsValidationforUser , GenrateToken }