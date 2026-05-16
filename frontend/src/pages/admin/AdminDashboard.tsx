import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Calendar, Ticket, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Nëse ke endpoint për stats, përdore. Për tani marrim nga events dhe bookings
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get('/api/events'),
        api.get('/api/bookings/my-bookings') // Mund ta ndryshosh më vonë për admin
      ]);

      setStats({
        totalEvents: eventsRes.data.length,
        totalBookings: bookingsRes.data.length,
        totalUsers: 42, // Mund ta bësh dinamike më vonë
        totalRevenue: bookingsRes.data.reduce((sum, b) => sum + b.totalAmount, 0)
      });

      setRecentBookings(bookingsRes.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Events</p>
                <p className="text-4xl font-bold">{stats.totalEvents}</p>
              </div>
              <Calendar className="text-indigo-600" size={48} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Bookings</p>
                <p className="text-4xl font-bold">{stats.totalBookings}</p>
              </div>
              <Ticket className="text-green-600" size={48} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Users</p>
                <p className="text-4xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="text-purple-600" size={48} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Revenue</p>
                <p className="text-4xl font-bold">{stats.totalRevenue} €</p>
              </div>
              <TrendingUp className="text-emerald-600" size={48} />
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-3xl shadow p-8">
          <h2 className="text-2xl font-semibold mb-6">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4">Event</th>
                  <th className="text-left py-4">User</th>
                  <th className="text-left py-4">Amount</th>
                  <th className="text-left py-4">Status</th>
                  <th className="text-left py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 font-medium">{booking.event.title}</td>
                    <td className="py-4">{booking.user?.firstName} {booking.user?.lastName}</td>
                    <td className="py-4 font-semibold">{booking.totalAmount} €</td>
                    <td className="py-4">
                      <span className={`px-4 py-1 rounded-full text-sm
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString('sq-AL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}