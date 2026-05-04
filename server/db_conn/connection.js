const mongoose = require('mongoose');

require('dotenv').config();


async function MongoDB(){
    try {
        
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Database connected Successfully");

    } catch (error) {
        console.log("error while creating a DB connection connection.js");
        console.log(error.message);

    }
}


module.exports = MongoDB;
