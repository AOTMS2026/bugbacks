import { Twitter, Instagram, Facebook, MapPin, Mail, Phone } from "lucide-react"
import { Link } from "react-router-dom"
import logo from "../../public/logo.png"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white py-24 border-t border-black/5 dark:border-white/5 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Column 1: Logo & Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="logo" className="h-24 w-auto object-contain" />
            </Link>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              Your ultimate AI-powered travel companion. We turn weeks of stressful planning into seconds of magic, helping you explore the world smarter and better.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <a href="https://www.google.com/maps/search/?api=1&query=205+1st+Floor+Krishna+Sadan+Gandhi+Nagar+Vijayawasa+520003" target="_blank" rel="noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  205, 1st Floor, Krishna Sadan,<br />Gandhi Nagar, Vijayawada - 520003
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <a href="mailto:bagpackholidaytours@gmail.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">bagpackholidaytours@gmail.com</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                <a href="tel:+919553698159" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">+91 955-369-8159</a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6 lg:pl-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 dark:text-white">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/destinations" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Destinations</Link></li>
              <li><a href="#packages" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Packages</a></li>
              <li><a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#specials" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Special Offers</a></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 dark:text-white">Subscribe</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Join our newsletter to get the latest travel tips, special offers, and AI updates.</p>
            <div className="flex flex-col gap-3 max-w-sm">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors text-black dark:text-white"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap shadow-lg shadow-indigo-500/30">
                Join Now
              </button>
            </div>
          </div>

          {/* Column 4: App Download & Socials */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 dark:text-white">Download App</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Plan on the go. Available for iOS and Android.</p>
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center text-xs font-bold border border-black/10 dark:border-white/10 hover:-translate-y-1 transition-all cursor-pointer shadow-lg">App Store</div>
              <div className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center text-xs font-bold border border-black/10 dark:border-white/10 hover:-translate-y-1 transition-all cursor-pointer shadow-lg">Google Play</div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-400 dark:text-gray-500">© {new Date().getFullYear()} AI Travel. All Rights Reserved.</p>
          <div className="flex gap-8 text-sm text-gray-400 dark:text-gray-500 font-medium">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Cookies</a>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-indigo-500 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-pink-500 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Action Button */}
      <a 
        href="https://wa.me/919553698159" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        <span className="absolute right-full mr-4 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us!
        </span>
      </a>
    </footer>
  )
}
