const mongoose = require('mongoose');

const CostEstimationSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transportOptions: [{
    mode: String,
    cost: Number,
    duration: String,
    pros: String,
    cons: String
  }],
  hotelOptions: [{
    name: String,
    costPerNight: Number,
    rating: Number,
    distanceFromCenter: String
  }],
  breakdown: {
    transport: Number,
    hotel: Number,
    food: Number,
    activities: Number,
    other: Number
  },
  totalEstimatedCost: Number,
  userBudget: Number,
  status: {
    type: String,
    enum: ['Within Budget', 'Exceeds Budget'],
    default: 'Within Budget'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CostEstimation', CostEstimationSchema);
