const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Trip = require('./models/Trip');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_API;

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not defined in .env file. Using default "secret_key"');
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: newUser._id, fullName, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to verify JWT
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Auth Header received:', authHeader ? 'Yes' : 'No');
  
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    console.log('Token decoded successfully for user:', decoded.id);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Trip Planning Route
app.post('/api/plan-trip', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('Planning trip with prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert travel agent. You MUST respond with a valid JSON object.
          The JSON must follow this exact structure:
          {
            "origin": "City, Country",
            "destination": "City, Country",
            "originCoordinates": { "lat": number, "lng": number },
            "destinationCoordinates": { "lat": number, "lng": number },
            "duration": "X Days",
            "budget": "₹XXXXX",
            "days": [
              {
                "day": 1,
                "title": "Day Title",
                "activities": ["Activity 1", "Activity 2"],
                "hotel": "Hotel Name & Description",
                "food": ["Dish 1", "Restaurant 1"],
                "places": ["Place 1", "Place 2"],
                "dailyBudget": "₹XXXX",
              }
            ]
          }
          
          IMPORTANT: 
          1. All currency must be in INR (₹).
          2. Coordinates must be accurate for the locations.
          3. Do not include any text outside the JSON object.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    console.log('OpenAI Response received');

    try {
      const itinerary = JSON.parse(content);
      res.json(itinerary);
    } catch (parseErr) {
      console.error('JSON Parse Error:', parseErr, 'Raw Content:', content);
      res.status(500).json({ message: 'AI returned invalid data format. Please try again.' });
    }
  } catch (err) {
    console.error('OpenAI API Error:', err);
    const errorMessage = err.error?.message || err.message || 'Failed to generate itinerary';
    res.status(500).json({ message: `OpenAI Error: ${errorMessage}` });
  }
});

// Save Trip Route
app.post('/api/save-trip', auth, async (req, res) => {
  try {
    console.log('--- Save Trip Request ---');
    console.log('User ID from token:', req.user.id);
    
    const { origin, destination, originCoordinates, destinationCoordinates, days, budget, duration } = req.body;
    
    // Log the received data for debugging
    console.log('Received trip data:', {
      origin,
      destination,
      daysCount: days?.length,
      budget,
      duration
    });

    if (!origin || !destination || !days || !Array.isArray(days)) {
      console.error('Validation failed: Missing required fields or days is not an array');
      return res.status(400).json({ 
        message: 'Invalid trip data. Please ensure origin, destination, and days are provided.' 
      });
    }

    const newTrip = new Trip({
      userId: req.user.id,
      origin,
      destination,
      originCoordinates,
      destinationCoordinates,
      days,
      budget,
      duration
    });

    const savedTrip = await newTrip.save();
    console.log('Trip saved successfully with ID:', savedTrip._id);
    res.status(201).json(savedTrip);
  } catch (err) {
    console.error('Error in /api/save-trip:', err);
    res.status(500).json({ message: 'Internal server error while saving trip: ' + err.message });
  }
});

// Get User Trips Route
app.get('/api/my-trips', auth, async (req, res) => {
  try {
    console.log('Fetching trips for user ID:', req.user.id);
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    console.log(`Found ${trips.length} trips for user`);
    res.json(trips);
  } catch (err) {
    console.error('Error fetching trips:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete Trip Route
app.delete('/api/delete-trip/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
