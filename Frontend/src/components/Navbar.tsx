import { Globe, Menu, X, User, LogOut, ChevronDown, Sparkles, Sun, Moon } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-black dark:text-white" />
            <span className="text-2xl font-bold tracking-tighter text-black dark:text-white font-oswald uppercase">Travel<span className="text-gray-500">Planner</span></span>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {user && (
                <Link to="/planner" className="text-black dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Create Trip</Link>
              )}
              <Link to="/destinations" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Destinations</Link>
              {user && (
                <Link to="/my-trips" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">My Trips</Link>
              )}
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Blog</a>
              
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
                      <span className="font-medium">{user.fullName.split(' ')[0]}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/10 rounded-3xl shadow-2xl py-4 z-50 overflow-hidden">
                        <div className="px-6 pb-4 border-b border-black/5 dark:border-white/5">
                          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">User Profile</p>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xl">
                              {user.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-base font-bold text-black dark:text-white">{user.fullName}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="px-2 pt-2">
                          <div className="px-4 py-2">
                            <Link 
                              to="/planner" 
                              onClick={() => setIsProfileOpen(false)}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all mb-2"
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>Create New Trip</span>
                            </Link>

                            <Link 
                              to="/my-trips" 
                              onClick={() => setIsProfileOpen(false)}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 text-black dark:text-white font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-all mb-4"
                            >
                              <MapPin className="w-4 h-4" />
                              <span>My Saved Trips</span>
                            </Link>
                            
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-1">Account Details</p>
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
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-medium transition-colors">
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
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-black border-b border-black/5 dark:border-white/10">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {user && (
              <Link to="/planner" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">Create Trip</Link>
            )}
            <Link to="/destinations" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10">Destinations</Link>
            {user && (
              <Link to="/my-trips" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10">My Trips</Link>
            )}
            <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10">Blog</a>
            {!user && (
              <div className="pt-4 flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10">Login</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium bg-black dark:bg-white text-white dark:text-black text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
