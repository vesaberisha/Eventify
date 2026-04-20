import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">E</div>
            <span className="text-3xl font-bold tracking-tight text-gray-900">Eventify</span>
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-8 text-lg">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <Link to="/events" className="hover:text-indigo-600 transition">Events</Link>
            <Link to="/categories" className="hover:text-indigo-600 transition">Categories</Link>
            <Link to="/venues" className="hover:text-indigo-600 transition">Venues</Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {/* Search icon (optional) */}
            <button className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
              <Search size={22} />
            </button>

            {/* Login / Register */}
            <Link 
              to="/login" 
              className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-indigo-600 text-white px-6 py-2 rounded-2xl font-semibold hover:bg-indigo-700 transition"
            >
              Register
            </Link>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-6 py-6 flex flex-col gap-6 text-lg">
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-indigo-600">Home</Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className="hover:text-indigo-600">Events</Link>
            <Link to="/categories" onClick={() => setIsOpen(false)} className="hover:text-indigo-600">Categories</Link>
            <Link to="/venues" onClick={() => setIsOpen(false)} className="hover:text-indigo-600">Venues</Link>
            
            <div className="pt-4 border-t flex flex-col gap-3">
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-3 text-gray-700 font-medium">Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="text-center bg-indigo-600 text-white py-3 rounded-2xl font-semibold">Register</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
