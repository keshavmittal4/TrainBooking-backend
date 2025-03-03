// This is my maiin code file where I have initialized the server and connected to the database.
// I have also initialized the seats in the database if there are no seats present.
// I have also used the middleware and routes in this file.
// I have also used the cors middleware to allow cross-origin requests.
// I have also used the dotenv package to load environment variables from a .env file.
// I have also used the express.json() middleware to parse incoming requests with JSON payloads.
// I have also used the seatRouter and router in this file.
// I have also used the authRoutes in this file.
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors
const connectToDatabase = require('./db/db');
const seatRouter = require('./routes/seatRouter');
const router = require('./routes/authRoutes');
const { seatModel } = require('./models/trainSeatModel');

const app = express();
// Use cors middleware
app.use(cors());

// Used express.json() middleware 
app.use(express.json());

connectToDatabase().then(async () => {
    const count = await seatModel.countDocuments();
    if (count === 0) {
        const seatsArray = [];
        // For rows 1 to 11 (7 seats each)
        for (let row = 1; row <= 11; row++) {
            for (let seat = 1; seat <= 7; seat++) {
                seatsArray.push({ seatNo: seat, rowNumber: row, isBooked: false });
            }
        }
        // Last row (row 12) with 3 seats
        for (let seat = 1; seat <= 3; seat++) {
            seatsArray.push({ seatNo: seat, rowNumber: 12, isBooked: false });
        }
        await seatModel.insertMany(seatsArray);
        console.log("Seats initialized in the database.");
    }
});

app.use('/api/auth', router);       
app.use('/api/seats', seatRouter);  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
