import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home"
import { Destination } from "./pages/Destination"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import Planner from "./pages/Planner"
import MyTrips from "./pages/MyTrips"
import { Toaster } from "react-hot-toast"

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
            <Route path="/planner" element={<Planner />} />
            <Route path="/my-trips" element={<MyTrips />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
