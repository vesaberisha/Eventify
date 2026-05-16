import { useState, useEffect } from 'react';
import api from '../../services/api';
import EventCard from '../../components/EventCard';
import { mapEventForCard } from '../../utils/eventUtils';
import { Search } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, price-low, price-high

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, selectedCategory, startDate, endDate, minPrice, maxPrice, sortBy]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        q: searchTerm,
        category: selectedCategory,
        startDate: startDate,
        endDate: endDate,
        minPrice: minPrice,
        maxPrice: maxPrice,
        sortBy: sortBy
      };

      const res = await api.get('/api/events', { params });
      setEvents(res.data.map(mapEventForCard));
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Discover Events</h1>

        {/* Advanced Filters */}
        <div className="bg-white p-8 rounded-3xl shadow-lg mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Kërko</label>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Emër eventi ose fjalë kyçe..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <select
                className="w-full py-3 px-4 border border-gray-300 rounded-2xl focus:outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Të gjitha kategoritë</option>
                <option value="Teknologji">Teknologji</option>
                <option value="Muzikë">Muzikë</option>
                <option value="Sport">Sport</option>
                <option value="Konferencë">Konferencë</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Data nga</label>
              <input
                type="date"
                className="w-full py-3 px-4 border border-gray-300 rounded-2xl"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data deri</label>
              <input
                type="date"
                className="w-full py-3 px-4 border border-gray-300 rounded-2xl"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Çmimi min (€)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full py-3 px-4 border border-gray-300 rounded-2xl"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Çmimi max (€)</label>
              <input
                type="number"
                placeholder="500"
                className="w-full py-3 px-4 border border-gray-300 rounded-2xl"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium mb-2">Rendit sipas</label>
              <select
                className="w-full py-3 px-4 border border-gray-300 rounded-2xl"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Data (më të afërt)</option>
                <option value="price-low">Çmimi (nga më i ulëti)</option>
                <option value="price-high">Çmimi (nga më i larti)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setSearchTerm(''); setSelectedCategory(''); setStartDate('');
              setEndDate(''); setMinPrice(''); setMaxPrice('');
            }}
            className="mt-6 text-red-600 hover:text-red-700 font-medium"
          >
            Pastro Filtrat
          </button>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            Rezultate: {events.length} evente
          </h2>
        </div>

        {loading ? (
          <p className="text-center py-10">Loading events...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}