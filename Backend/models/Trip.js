const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  origin: String,
  destination: String,
  originCoordinates: {
    lat: Number,
    lng: Number
  },
  destinationCoordinates: {
    lat: Number,
    lng: Number
  },
  days: [{
    day: Number,
    title: String,
    activities: [String],
    hotel: String,
    food: [String],
    places: [String],
    dailyBudget: String,
    imageUrl: String
  }],
  budget: String,
  duration: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trip', TripSchema);
