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
    dailyTravel: {
      distance: String,
      mode: String,
      timings: String,
      cost: String
    },
    activities: [{
      name: String,
      time: String,
      cost: String
    }],
    hotel: String,
    food: [{
      item: String,
      restaurant: String,
      time: String,
      cost: String
    }],
    places: [{
      name: String,
      visitTimings: String,
      entryFee: String
    }],
    dailyBudget: String,
    imageUrl: String
  }],
  budget: String,
  initialJourney: {
    distance: String,
    duration: String,
    transportType: String,
    departureTime: String,
    arrivalTime: String,
    cost: String
  },
  budgetBreakdown: {
    longDistanceTransport: String,
    localTransport: String,
    accommodation: String,
    food: String,
    activities: String,
    waterAndRefreshments: String,
    miscellaneous: String
  },
  duration: String,
  transportation: String,
  realTimeData: {
    weather: String,
    traffic: String,
    safety: String,
    events: String
  },
  bookingSuggestions: {
    transport: String,
    accommodation: String,
    activities: String
  },
  extraMoneySuggestion: String,
  groupSplitting: {
    totalPerPerson: String,
    dayWisePerPerson: [{
      day: Number,
      amount: String
    }]
  },
  vehicleComparison: [{
    vehicle: String,
    duration: String,
    cost: String,
    pros: String,
    cons: String,
    bestFor: String
  }],
  aiInsights: {
    whyTheseOptions: String,
    tips: [String],
    dos: [String],
    donts: [String],
    waitingTimeEstimates: String
  },
  checklist: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trip', TripSchema);
