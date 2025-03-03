const mongoose = require('mongoose')

const seatSchema = new mongoose.Schema({
// scheme for the seat model
    seatNo: {
        type: Number,
        // required: true
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    rowNumber: {
        type: Number,
        // required: true
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
});
const seatModel = mongoose.model('Seat', seatSchema)
module.exports = { seatModel };