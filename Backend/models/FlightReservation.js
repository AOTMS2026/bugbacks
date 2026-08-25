const mongoose = require('mongoose');

const flightReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  departureCity: {
    type: String,
    required: true,
    trim: true
  },
  arrivalCity: {
    type: String,
    required: true,
    trim: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date // Optional for one-way trips
  },
  passengers: {
    type: Number,
    default: 1,
    min: 1
  },
  cabinClass: {
    type: String,
    enum: ['Economy', 'Premium Economy', 'Business', 'First Class'],
    default: 'Economy'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FlightReservation', flightReservationSchema);
