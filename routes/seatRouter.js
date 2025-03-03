const express = require('express');
const seatRouter = express.Router();
const { seatModel } = require('../models/trainSeatModel');
const { checkCount } = require('../middleware/count');
const { protect } = require('../middleware/auth');

// Retrieve all seats sorted by row and seat number
seatRouter.get('/', async (req, res) => {
    try {
        const seats = await seatModel.find().sort({ rowNumber: 1, seatNo: 1 });
        const availableSeats = await seatModel.countDocuments({ isBooked: false });

        res.status(200).json({ availableSeats, seats });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch seat data", error });
    }
});

// Book seats based on availability
seatRouter.patch('/bookticket', protect, checkCount, async (req, res) => {
    const requiredSeats = req.body.seats;
    console.log("Requested seats:", requiredSeats);

    try {
        // Retrieve all seats sorted by row and seat number
        const seats = await seatModel.find().sort({ rowNumber: 1, seatNo: 1 });

        // Organize seats by row for better grouping
        const seatRows = {};
        seats.forEach(seat => {
            if (!seatRows[seat.rowNumber]) seatRows[seat.rowNumber] = [];
            seatRows[seat.rowNumber].push(seat);
        });

        let allocatedSeats = [];
        for (const row in seatRows) {
            const rowSeats = seatRows[row];
            let tempBlock = [];

            for (let i = 0; i < rowSeats.length; i++) {
                if (!rowSeats[i].isBooked) {
                    if (tempBlock.length === 0 || rowSeats[i].seatNo === tempBlock[tempBlock.length - 1].seatNo + 1) {
                        tempBlock.push(rowSeats[i]);
                    } else {
                        tempBlock = [rowSeats[i]];
                    }
                    if (tempBlock.length === requiredSeats) {
                        for (let seat of tempBlock) {
                            allocatedSeats.push(`Row ${seat.rowNumber} Seat ${seat.seatNo}`);
                            await seatModel.findByIdAndUpdate(seat._id, { isBooked: true, bookedBy: req.user.id });
                        }
                        break;
                    }
                } else {
                    tempBlock = [];
                }
            }
            if (allocatedSeats.length === requiredSeats) break;
        }

        // If contiguous seats aren't available, book any available ones
        if (allocatedSeats.length !== requiredSeats) {
            const availableSeats = await seatModel.find({ isBooked: false }).sort({ rowNumber: 1, seatNo: 1 });
            if (availableSeats.length < requiredSeats) {
                return res.status(400).json({ message: "Not enough seats available" });
            } else {
                allocatedSeats = [];
                for (let i = 0; i < requiredSeats; i++) {
                    allocatedSeats.push(`Row ${availableSeats[i].rowNumber} Seat ${availableSeats[i].seatNo}`);
                    await seatModel.findByIdAndUpdate(availableSeats[i]._id, { isBooked: true, bookedBy: req.user.id });
                }
            }
        }

        res.status(200).json({ message: "Seats booked successfully", allocatedSeats });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: "Seat booking failed", error });
    }
});

// Reset all booked seats to available
seatRouter.patch('/resetbooking', protect, async (req, res) => {
    try {
        await seatModel.updateMany({ isBooked: true }, { isBooked: false, bookedBy: null });
        res.status(200).json({ message: "All seats have been reset and are now available." });
    } catch (error) {
        console.error("Reset error:", error);
        res.status(400).json({ message: "Failed to reset seats", error });
    }
});

module.exports = seatRouter;
