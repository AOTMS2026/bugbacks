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
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_ROTER_API_KEY || process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000", // Optional, for OpenRouter rankings
    "X-Title": "AI Travel Planner", // Optional
  }
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
      model: "openai/gpt-4o-mini",
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
            "initialJourney": {
              "distance": "XXXX km",
              "duration": "XX hours/days",
              "transportType": "Train/Bus/Flight",
              "departureTime": "HH:MM AM/PM",
              "arrivalTime": "HH:MM AM/PM",
              "cost": "₹XXXX"
            },
            "budgetBreakdown": {
              "longDistanceTransport": "₹XXXX (Train/Bus/Flight)",
              "localTransport": "₹XXXX (Auto/Taxi/Local Train)",
              "accommodation": "₹XXXX",
              "food": "₹XXXX",
              "activities": "₹XXXX",
              "waterAndRefreshments": "₹XXXX",
              "miscellaneous": "₹XXXX"
            },
            "transportation": "Recommended transport (e.g., Flight, Train, Local Taxi)",
            "realTimeData": {
              "weather": "Current weather summary",
              "traffic": "Typical traffic conditions",
              "safety": "Safety tips and alerts",
              "events": "Upcoming local events"
            },
            "bookingSuggestions": {
              "transport": "Where to book (e.g., IRCTC for trains, RedBus for buses)",
              "accommodation": "Where to book (e.g., Booking.com, MakeMyTrip)",
              "activities": "Where to book (e.g., Klook, GetYourGuide)"
            },
            "extraMoneySuggestion": "₹XXXX (Recommended buffer for emergencies/shopping)",
            "groupSplitting": {
              "totalPerPerson": "₹XXXX",
              "dayWisePerPerson": [
                { "day": 1, "amount": "₹XXXX" }
              ]
            },
            "vehicleComparison": [
              {
                "vehicle": "Train",
                "duration": "XX hours",
                "cost": "₹XXXX",
                "pros": "Comfortable, scenic",
                "cons": "Fixed timings",
                "bestFor": "Families/Long distance"
              },
              {
                "vehicle": "Bus",
                "duration": "XX hours",
                "cost": "₹XXXX",
                "pros": "Flexible, frequent",
                "cons": "Less comfort",
                "bestFor": "Budget travelers"
              },
              {
                "vehicle": "Car/Bike",
                "duration": "XX hours",
                "cost": "₹XXXX (Fuel + Toll)",
                "pros": "Complete freedom",
                "cons": "Driving fatigue",
                "bestFor": "Friends/Road trips"
              }
            ],
            "aiInsights": {
              "whyTheseOptions": "Explanation of why this plan is best for the user's group type. Specifically analyze if the budget is high for the distance and suggest luxury upgrades if so.",
              "tips": ["Tip 1", "Tip 2"],
              "dos": ["Do 1", "Do 2"],
              "donts": ["Don't 1", "Don't 2"],
              "waitingTimeEstimates": "Estimated waiting times at major attractions/transit."
            },
            "checklist": [
              "Aadhar Card (Original & Digital)",
              "PAN Card",
              "Mobile Power Bank & Charger",
              "Dress Code: [Specific suggestions based on destination/weather]",
              "Other essential items..."
            ],
            "days": [
              {
                "day": 1,
                "title": "Day Title",
                "dailyTravel": {
                  "distance": "XX km",
                  "mode": "Local Train/Bus/Taxi",
                  "timings": "e.g., 9:00 AM - 10:00 AM",
                  "cost": "₹XXXX"
                },
                "activities": [
                  { "name": "Activity 1", "time": "HH:MM AM/PM", "cost": "₹XXXX" },
                  { "name": "Activity 2", "time": "HH:MM AM/PM", "cost": "₹XXXX" }
                ],
                "hotel": "Hotel Name & Description",
                "food": [
                  { "item": "Dish 1", "time": "HH:MM AM/PM", "cost": "₹XXXX" },
                  { "restaurant": "Restaurant 1", "time": "HH:MM AM/PM", "cost": "₹XXXX" }
                ],
                "places": [
                  { "name": "Place 1", "visitTimings": "HH:MM AM - HH:MM PM", "entryFee": "₹XXXX" },
                  { "name": "Place 2", "visitTimings": "HH:MM AM - HH:MM PM", "entryFee": "₹XXXX" }
                ],
                "dailyBudget": "₹XXXX"
              }
            ]
          }
          
          IMPORTANT: 
          1. All currency must be in INR (₹).
          2. Coordinates must be accurate for the locations.
          3. Include realistic transportation and real-time data (weather, traffic, safety, events) based on the destination.
          4. Provide a detailed budget breakdown including specific costs for water, local transport (train/bus), long-distance transport, food, and activities.
          5. "initialJourney" should describe the travel from origin to destination with realistic departure/arrival times.
          6. "dailyTravel" should describe the local movement within the destination for that day with estimated timings.
          7. "places" must include realistic "visitTimings" (opening/closing hours).
          8. "activities" and "food" should have specific scheduled times.
          9. Do not include any text outside the JSON object.`
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

    const { origin, destination, originCoordinates, destinationCoordinates, days, budget, initialJourney, budgetBreakdown, duration, transportation, realTimeData, bookingSuggestions, extraMoneySuggestion, checklist, groupSplitting, vehicleComparison, aiInsights } = req.body;

    // Log the received data for debugging
    console.log('Received trip data:', {
      origin,
      destination,
      daysCount: days?.length,
      budget,
      initialJourney,
      budgetBreakdown,
      duration,
      transportation
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
      initialJourney,
      budgetBreakdown,
      duration,
      transportation,
      realTimeData,
      bookingSuggestions,
      extraMoneySuggestion,
      checklist,
      groupSplitting,
      vehicleComparison,
      aiInsights
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

const nodemailer = require('nodemailer');

// ... existing imports ...

// Send Trip Email Route
app.post('/api/send-trip-email', auth, async (req, res) => {
  try {
    const { email, tripData } = req.body;

    if (!email || !tripData) {
      return res.status(400).json({ message: 'Email and trip data are required' });
    }

    // Check for environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials missing in .env');
      return res.status(500).json({
        message: 'Server email configuration missing. Please contact support or set EMAIL_USER and EMAIL_PASS.'
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Map image generation removed to eliminate Google Maps dependency

    // Format Budget Breakdown
    const budgetHtml = tripData.budgetBreakdown ? `
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">💰 Budget Breakdown</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${Object.entries(tripData.budgetBreakdown).map(([key, value]) => `
            <tr>
              <td style="padding: 8px 0; color: #64748b; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1').trim()}</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: bold; text-align: right;">${value}</td>
            </tr>
          `).join('')}
          <tr style="border-top: 1px solid #cbd5e1;">
            <td style="padding: 12px 0; font-weight: bold; color: #0f172a;">Total Estimated</td>
            <td style="padding: 12px 0; font-weight: bold; color: #2563eb; text-align: right; font-size: 1.1em;">${tripData.budget}</td>
          </tr>
        </table>
      </div>
    ` : '';

    // Format Daily Itinerary
    const daysHtml = tripData.days.map(day => `
      <div style="margin-bottom: 30px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
             <h2 style="margin: 0; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Day ${day.day}</h2>
             <span style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 20px; font-size: 14px;">${day.dailyBudget}</span>
          </div>
          <h3 style="margin: 10px 0 0 0; font-size: 18px; font-weight: normal; opacity: 0.9;">${day.title}</h3>
        </div>
        
        <div style="padding: 20px;">
          ${day.hotel ? `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9;">
              <strong style="color: #475569;">🏨 Accommodation:</strong>
              <p style="margin: 5px 0; color: #1e293b;">${day.hotel}</p>
            </div>
          ` : ''}

          <div style="display: grid; gap: 15px;">
            <div>
              <strong style="color: #eab308;">✨ Activities</strong>
              <ul style="margin: 5px 0 15px 0; padding-left: 20px; color: #334155;">
                ${day.activities.map(act => `<li style="margin-bottom: 5px;"><strong>${act.time}</strong>: ${act.name} <span style="color: #64748b; font-size: 0.9em;">(${act.cost})</span></li>`).join('')}
              </ul>
            </div>

            ${day.food && day.food.length > 0 ? `
              <div>
                <strong style="color: #f97316;">🍽️ Food</strong>
                <ul style="margin: 5px 0 15px 0; padding-left: 20px; color: #334155;">
                  ${day.food.map(meal => `<li style="margin-bottom: 5px;"><strong>${meal.time}</strong>: ${meal.item || meal.restaurant} <span style="color: #64748b; font-size: 0.9em;">(${meal.cost})</span></li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');

    // Format Initial Journey
    const journeyHtml = tripData.initialJourney ? `
      <div style="background-color: #f0fdfa; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #ccfbf1;">
        <h3 style="margin-top: 0; color: #0f766e; border-bottom: 1px solid #99f6e4; padding-bottom: 10px;">🚀 Journey to Destination</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
           <p style="margin: 5px 0;"><strong>Distance:</strong> ${tripData.initialJourney.distance}</p>
           <p style="margin: 5px 0;"><strong>Duration:</strong> ${tripData.initialJourney.duration}</p>
           <p style="margin: 5px 0;"><strong>Mode:</strong> ${tripData.initialJourney.transportType}</p>
           <p style="margin: 5px 0;"><strong>Cost:</strong> ${tripData.initialJourney.cost}</p>
           <p style="margin: 5px 0;"><strong>Departure:</strong> ${tripData.initialJourney.departureTime}</p>
           <p style="margin: 5px 0;"><strong>Arrival:</strong> ${tripData.initialJourney.arrivalTime}</p>
        </div>
      </div>
    ` : '';

    // Format Do's and Don'ts
    const dosDontsHtml = tripData.aiInsights ? `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 30px;">
        <div style="background: #f0fdf4; padding: 15px; border-radius: 10px; border: 1px solid #bbf7d0;">
          <h4 style="margin-top: 0; color: #15803d;">✅ Do's</h4>
          <ul style="padding-left: 20px; margin-bottom: 0; color: #14532d; font-size: 14px;">
            ${(tripData.aiInsights.dos || []).map(item => `<li style="margin-bottom: 5px;">${item}</li>`).join('')}
          </ul>
        </div>
        <div style="background: #fef2f2; padding: 15px; border-radius: 10px; border: 1px solid #fecaca;">
          <h4 style="margin-top: 0; color: #b91c1c;">❌ Don'ts</h4>
          <ul style="padding-left: 20px; margin-bottom: 0; color: #7f1d1d; font-size: 14px;">
             ${(tripData.aiInsights.donts || []).map(item => `<li style="margin-bottom: 5px;">${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    ` : '';

    // Format Booking Suggestions
    const bookingHtml = tripData.bookingSuggestions ? `
      <div style="background: #fff7ed; padding: 20px; border-radius: 12px; margin-top: 30px; border: 1px solid #fed7aa;">
        <h3 style="margin-top: 0; color: #c2410c;">🔗 Booking Suggestions</h3>
        <ul style="padding-left: 20px; color: #7c2d12;">
          ${Object.entries(tripData.bookingSuggestions).map(([key, value]) => `
            <li style="margin-bottom: 8px;"><strong style="text-transform: capitalize;">${key}:</strong> ${value}</li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    // Format "Why this plan is best"
    const whyBestHtml = tripData.aiInsights && tripData.aiInsights.whyTheseOptions ? `
      <div style="background: #eef2ff; padding: 20px; border-radius: 12px; margin-top: 30px; border-left: 4px solid #6366f1;">
        <h3 style="margin-top: 0; color: #4338ca;">🤖 Why This Plan?</h3>
        <p style="color: #3730a3; margin: 0; line-height: 1.5;">${tripData.aiInsights.whyTheseOptions}</p>
      </div>
    ` : '';

    // Format Group Expense Summary
    const groupExpenseHtml = tripData.groupSplitting ? `
      <div style="background: #fafafa; padding: 20px; border-radius: 12px; margin-top: 30px; border: 1px solid #e5e7eb;">
        <h3 style="margin-top: 0; color: #374151;">👥 Group Expense Summary (Per Person)</h3>
        <p style="font-size: 18px; font-weight: bold; color: #059669; margin: 5px 0;">Total per person: ${tripData.groupSplitting.totalPerPerson}</p>
        <div style="margin-top: 10px;">
           <h4 style="margin: 10px 0 5px; color: #4b5563;">Day-wise Breakdown:</h4>
           <div style="display: flex; flex-wrap: wrap; gap: 8px;">
             ${(tripData.groupSplitting.dayWisePerPerson || []).map(day => `
               <span style="background: #fff; border: 1px solid #d1d5db; padding: 4px 8px; border-radius: 6px; font-size: 13px; color: #374151;">
                 Day ${day.day}: ${day.amount}
               </span>
             `).join('')}
           </div>
        </div>
      </div>
    ` : '';

    // Format Vehicle Comparison
    const vehicleHtml = tripData.vehicleComparison && tripData.vehicleComparison.length > 0 ? `
      <div style="margin-top: 30px;">
        <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">🚗 Vehicle Comparison & Guidance</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; min-width: 500px; font-size: 14px;">
            <thead style="background: #f1f5f9; color: #0f172a;">
              <tr>
                <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1;">Transport</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1;">Cost</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1;">Duration</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1;">Pros/Cons</th>
              </tr>
            </thead>
            <tbody>
              ${tripData.vehicleComparison.map(v => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${v.vehicle}</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">${v.cost}</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1;">${v.duration}</td>
                  <td style="padding: 10px; border: 1px solid #cbd5e1; color: #475569;">
                    <span style="color: #15803d;">+ ${v.pros}</span><br>
                    <span style="color: #b91c1c;">- ${v.cons}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : '';

    // Format Real-Time Data (Weather, Safety, etc.)
    const realTimeHtml = tripData.realTimeData ? `
      <div style="background: #eff6ff; padding: 20px; border-radius: 12px; margin-top: 30px; border: 1px solid #bfdbfe;">
         <h3 style="margin-top: 0; color: #1e40af;">🌦️ Travel Intelligence</h3>
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
               <strong style="color: #1d4ed8;">Weather Report</strong>
               <p style="margin: 5px 0; font-size: 14px; color: #334155;">${tripData.realTimeData.weather}</p>
            </div>
            <div>
               <strong style="color: #1d4ed8;">🚦 Traffic & Safety</strong>
               <p style="margin: 5px 0; font-size: 14px; color: #334155;">${tripData.realTimeData.traffic}. ${tripData.realTimeData.safety}</p>
            </div>
         </div>
         ${tripData.transportation ? `
           <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dbeafe;">
             <strong style="color: #1d4ed8;">🚌 Recommended Transport</strong>
             <p style="margin: 5px 0; font-size: 14px; color: #334155;">${tripData.transportation}</p>
           </div>
         ` : ''}
         ${tripData.realTimeData.events ? `
           <div style="margin-top: 15px;">
              <strong style="color: #1d4ed8;">🎉 Ongoing Events</strong>
               <p style="margin: 5px 0; font-size: 14px; color: #334155;">${tripData.realTimeData.events}</p>
           </div>
         ` : ''}
      </div>
    ` : '';

    // Format Smart Travel Tips & Checklist
    const tipsHtml = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
        ${tripData.aiInsights && tripData.aiInsights.tips ? `
          <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; border: 1px solid #bae6fd;">
            <h3 style="margin-top: 0; color: #0284c7;">💡 Smart Travel Tips</h3>
             <div style="display: flex; flex-direction: column; gap: 10px;">
               ${tripData.aiInsights.tips ? tripData.aiInsights.tips.map((tip, index) => `
                 <div style="background: white; padding: 10px; border-radius: 8px; border-left: 4px solid #0ea5e9; font-size: 14px; color: #0c4a6e; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                   <strong>Tip ${index + 1}:</strong> ${tip}
                 </div>
               `).join('') : ''}
             </div>
          </div>
        ` : ''}

        ${tripData.checklist ? `
          <div style="background: #fdf4ff; padding: 20px; border-radius: 12px; border: 1px solid #f5d0fe;">
            <h3 style="margin-top: 0; color: #c026d3;">🎒 Packing Checklist</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${tripData.checklist.map(item => `
                <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: white; border-radius: 6px; border: 1px dashed #e879f9;">
                  <span style="color: #d946ef;">☐</span>
                  <span style="font-size: 14px; color: #701a75;">${item}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Format Days Suggestion (Group Splitting Day-wise Detailed)
    const daysSuggestionHtml = tripData.groupSplitting && tripData.groupSplitting.dayWisePerPerson ? `
      <div style="background: #fafafa; padding: 20px; border-radius: 12px; margin-top: 30px; border: 1px solid #e5e7eb;">
         <h3 style="margin-top: 0; color: #374151;">📅 Days Suggestion (Per Person Breakdown)</h3>
         <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-top: 10px;">
           ${tripData.groupSplitting.dayWisePerPerson.map(day => `
             <div style="background: white; border: 1px solid #d1d5db; padding: 10px; border-radius: 8px; text-align: center;">
               <div style="font-weight: bold; color: #4b5563; font-size: 13px;">Day ${day.day}</div>
               <div style="color: #059669; font-weight: bold; font-size: 15px;">${day.amount}</div>
             </div>
           `).join('')}
         </div>
      </div>
    ` : '';

    // Format Extra Money Suggestion
    const extraMoneyHtml = tripData.extraMoneySuggestion ? `
      <div style="background: #fffbeb; padding: 20px; border-radius: 12px; margin-top: 30px; border: 1px solid #fcd34d;">
        <h3 style="margin-top: 0; color: #b45309;">💵 Extra Money Suggestion</h3>
        <p style="color: #92400e; font-size: 16px; font-weight: bold; margin: 0;">${tripData.extraMoneySuggestion}</p>
        <p style="color: #b45309; font-size: 13px; margin: 5px 0 0;">(Recommended buffer for emergencies/shopping)</p>
      </div>
    ` : '';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `✈️ Your Complete Trip Plan: ${tripData.origin} to ${tripData.destination}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; color: #333; line-height: 1.6; background-color: #fafafa; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <div style="text-align: center; padding-bottom: 30px; border-bottom: 2px solid #f3f4f6; margin-bottom: 30px;">
              <h1 style="color: #1e293b; margin: 0 0 10px 0; font-size: 32px;">Trip to ${tripData.destination}</h1>
              <p style="color: #64748b; font-size: 16px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Planned from ${tripData.origin}</p>
            </div>


            <!-- Main Travel Guide Sections -->
            ${journeyHtml}

            <!-- Overview -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
              <div style="background: #eff6ff; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #dbeafe;">
                <span style="display: block; font-size: 28px; margin-bottom: 5px;">⏱️</span>
                <strong style="color: #1e40af; display: block; font-size: 14px; text-transform: uppercase;">Duration</strong>
                <span style="font-size: 18px; font-weight: bold; color: #1e3a8a;">${tripData.duration}</span>
              </div>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #bbf7d0;">
                <span style="display: block; font-size: 28px; margin-bottom: 5px;">💵</span>
                <strong style="color: #166534; display: block; font-size: 14px; text-transform: uppercase;">Est. Budget</strong>
                <span style="font-size: 18px; font-weight: bold; color: #14532d;">${tripData.budget}</span>
              </div>
            </div>

            ${realTimeHtml}
            ${whyBestHtml}
            ${budgetHtml}
            ${extraMoneyHtml}
            ${groupExpenseHtml}
            ${daysSuggestionHtml}
            ${vehicleHtml}

            <h2 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-top: 50px; margin-bottom: 25px; font-size: 24px;">📅 Detailed Day-by-Day Itinerary</h2>
            ${daysHtml}

            ${dosDontsHtml}
            ${bookingHtml}
            ${tipsHtml}

            <!-- Footer -->
            <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 1px solid #f3f4f6; color: #94a3b8; font-size: 13px;">
              <p style="margin-bottom: 10px;">Planned with <strong style="color: #2563eb;">AI Travel Agent</strong></p>
              <p>Have a safe and wonderful trip! 🌍</p>
            </div>
          
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}`);
    res.json({ message: 'Trip itinerary sent successfully!' });

  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: 'Failed to send email: ' + err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
