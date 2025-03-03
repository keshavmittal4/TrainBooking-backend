
const mongoose = require("mongoose");
// connecting the database with the help of mongoose
const connectToDatabase = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);

        console.log('Successfully connected to the database', connect.connection.host);

    } catch (error) {
        console.log("MongoDB connection error ", error.message);
        throw error;
    }
};

module.exports = connectToDatabase;