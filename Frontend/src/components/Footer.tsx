import { Twitter, Instagram, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white py-24 border-t border-black/5 dark:border-white/5 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Powered by</h4>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Live better</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Call center</h4>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">International call center</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Subscribe to our newsletter</h4>
            <div className="flex gap-2 max-w-sm">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors text-black dark:text-white"
              />
              <button className="bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap text-black dark:text-white">
                Join Now
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Download our mobile app</h4>
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer">App Store</div>
              <div className="px-6 py-3 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer">Google Play</div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-10 text-sm text-gray-400 dark:text-gray-500">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Cookies</a>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">© 2024 All Rights Reserved</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
