import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, MapPin, Clock, Ticket } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/api/bookings/my-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading your bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow">
            <Ticket size={80} className="mx-auto text-gray-300 mb-4" />
            <p className="text-2xl text-gray-500">You don't have any bookings yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-3xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
                {/* Event Info */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">{booking.event.title}</h3>
                  
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center gap-3">
                      <Calendar size={20} />
                      <span>{new Date(booking.event.startDate).toLocaleDateString('sq-AL', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin size={20} />
                      <span>{booking.event.venue?.name} — {booking.event.venue?.address}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="md:w-80 border-l md:border-l pl-0 md:pl-8">
                  <div className="mb-6">
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    {booking.totalAmount} €
                  </div>
                  <p className="text-sm text-gray-500 mb-6">Total Amount</p>

                  <div className="flex items-center gap-2 text-gray-600 mb-6">
                    <Ticket size={20} />
                    <span>{booking.tickets?.length || 0} Ticket(s)</span>
                  </div>

                  {booking.status === 'confirmed' && (
                    <button className="w-full bg-indigo-600 text-white py-3 rounded-2xl hover:bg-indigo-700 transition">
                      Shiko Biletat (QR Code)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}