const mongoose = require('mongoose');

const SuggestionSchema = new mongoose.Schema({
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
  text: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['activity', 'place', 'food', 'other'],
    default: 'place'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);
