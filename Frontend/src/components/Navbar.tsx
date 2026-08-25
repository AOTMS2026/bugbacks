import { Menu, X, User, LogOut, ChevronDown, Sparkles, Sun, Moon, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"
import logo from ".././../public/logo.png"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9999] w-full transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-lg" 
        : "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-transparent"
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="logo" className="h-14 w-auto object-contain md:h-16" />
            </Link>
          </motion.div>

          <div className="hidden md:flex flex-1 justify-end">
            <div className="flex items-center space-x-6 lg:space-x-8">

              <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/destinations" className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Destinations</Link>
              </motion.div>
              {user && (
                <>
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link to="/my-trips" className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Trip Details</Link>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link to="/profile" className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Profile</Link>
                  </motion.div>
                </>
              )}
              <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <a href="#about" className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">About</a>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <a href="#specials" className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Specials
                </a>
              </motion.div>
              

              <div className="flex items-center gap-4 ml-4 border-l border-black/10 dark:border-white/10 pl-8">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-black dark:text-white"
                  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center border border-black/10 dark:border-white/20">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{user?.fullName?.split(' ')[0] || 'User'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/10 rounded-3xl shadow-2xl py-4 z-50 overflow-hidden"
                        >
                          <div className="px-6 pb-4 border-b border-black/5 dark:border-white/5">
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">User Profile</p>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xl">
                                {user?.fullName?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="text-base font-bold text-black dark:text-white">{user?.fullName || 'User'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                              </div>
                            </div>
                          </div>

                          <div className="px-2 pt-2">
                            <div className="px-4 py-2">
                              <div className="mb-2"></div>                              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-1">Account Details</p>
                              <div className="bg-black/5 dark:bg-black/40 rounded-xl p-3 border border-black/5 dark:border-white/5">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                                <p className="text-sm text-black dark:text-white font-medium">{user.email}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                logout()
                                setIsProfileOpen(false)
                              }}
                              className="w-full flex items-center gap-3 px-6 py-3 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-all mt-2"
                            >
                              <LogOut className="w-4 h-4" />
                              <span className="font-bold">Logout from Session</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors">
                      Login
                    </Link>
                    <Link to="/signup" className="rounded-full bg-black dark:bg-white px-6 py-2 text-sm font-bold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-black dark:text-white"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-black dark:text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white dark:bg-black border-b border-black/5 dark:border-white/10 overflow-hidden"
          >
            <div className="space-y-1 px-4 pb-3 pt-2">

              <Link to="/destinations" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">Destinations</Link>
              {user && (
                <>
                  <Link to="/my-trips" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">My Trips</Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">Profile</Link>
                </>
              )}
              <a href="#about" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">About</a>
              <a href="#specials" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Specials
              </a>
              {!user && (
                <div className="pt-4 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">Login</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium bg-black dark:bg-white text-white dark:text-black text-center">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
