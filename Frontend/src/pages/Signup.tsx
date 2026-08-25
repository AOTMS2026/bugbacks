import { motion } from "framer-motion"
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Navbar } from "../components/Navbar"

export function Signup() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        login(data.user, data.token)
        navigate("/")
      } else {
        setError(data.message || "Signup failed")
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col transition-colors duration-300">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-20 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2 font-oswald uppercase">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Start planning your next adventure today</p>
        </div>

        <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-black/5 dark:border-white/10 rounded-4xl p-8 shadow-2xl">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 focus:ring-0 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 focus:ring-0 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl py-4 pl-12 pr-12 text-black dark:text-white focus:border-black/30 dark:focus:border-white/30 focus:ring-0 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all group mt-4">
              Create Account
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-black dark:text-white font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
        </motion.div>
      </div>
    </div>
  )
}
