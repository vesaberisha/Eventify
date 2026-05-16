import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { unreadCount } = useNotifications(user?.id);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">E</div>
            <span className="text-3xl font-bold tracking-tight text-gray-900">Eventify</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-lg">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <Link to="/events" className="hover:text-indigo-600 transition">Events</Link>
            <Link to="/categories" className="hover:text-indigo-600 transition">Categories</Link>
            <Link to="/my-bookings" className="hover:text-indigo-600 transition">My Bookings</Link>
            {user?.role === 'ADMIN' && (
  <Link to="/admin" className="hover:text-indigo-600 transition">Admin</Link>
)}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {user && (
  <div className="relative cursor-pointer" onClick={() => {/* hap modal notifications */}}>
    <div className="relative">
      <span className="text-2xl">🛎️</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  </div>
)}
            
            {user ? (
              
              <>
                <div className="hidden md:flex items-center gap-2 text-gray-700">
                  <User size={20} />
                  <span className="font-medium">{user.firstName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-6 py-2 rounded-2xl font-semibold hover:bg-indigo-700 transition">Register</Link>
              </>
            )}

            {/* Mobile Hamburger */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-6 py-6 flex flex-col gap-6 text-lg">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/events" onClick={() => setIsOpen(false)}>Events</Link>
            {user ? (
              <button onClick={handleLogout} className="text-left text-red-600">Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}