import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home"
import { Destination } from "./pages/Destination"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import Planner from "./pages/Planner"
import MyTrips from "./pages/MyTrips"
import Profile from "./pages/Profile"
import { HotelBookingForm } from "./pages/Booking/HotelBookingForm"
import { FlightBookingForm } from "./pages/Booking/FlightBookingForm"
import { ServiceBookingForm } from "./pages/Booking/ServiceBookingForm"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./components/ProtectedRoute"
import { ChatBot } from "./components/ChatBot"

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destination />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/planner" element={
              <ProtectedRoute>
                <Planner />
              </ProtectedRoute>
            } />
            <Route path="/my-trips" element={
              <ProtectedRoute>
                <MyTrips />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/booking/hotel" element={
              <ProtectedRoute>
                <HotelBookingForm />
              </ProtectedRoute>
            } />
            <Route path="/booking/flight" element={
              <ProtectedRoute>
                <FlightBookingForm />
              </ProtectedRoute>
            } />
            <Route path="/booking/service" element={
              <ProtectedRoute>
                <ServiceBookingForm />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <ChatBot />
      </div>
    </Router>
  )
}

export default App
