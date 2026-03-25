import { useState } from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';
import EventCard from '../../components/EventCard';

const mockEvents = [
  { id: 1, title: "Tech Conference 2026", date: "2026-04-15", location: "Prishtina, Kosovo", price: 49.99, image: "https://picsum.photos/id/1015/800/600", category: "Teknologji" },
  { id: 2, title: "Music Festival Summer", date: "2026-06-20", location: "Prizren, Kosovo", price: 29.99, image: "https://picsum.photos/id/201/800/600", category: "Muzikë" },
  { id: 3, title: "Kosovo Startup Summit", date: "2026-05-10", location: "Prishtina, Kosovo", price: 0, image: "https://picsum.photos/id/301/800/600", category: "Teknologji" },
  { id: 4, title: "Basketball Final", date: "2026-03-30", location: "Gjilan, Kosovo", price: 15, image: "https://picsum.photos/id/401/800/600", category: "Sport" },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredEvents = mockEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || event.category === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-24">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h1 className="text-7xl font-bold mb-4">Eventify</h1>
          <p className="text-3xl mb-10">Gjej dhe rezervoni eventin më të mirë në Kosovë</p>
          
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-2 shadow-2xl flex items-center">
            <div className="flex-1 flex items-center gap-4 px-8">
              <Search className="text-gray-400" size={28} />
              <input
                type="text"
                placeholder="Kërko event, koncert, konferencë..."
                className="flex-1 outline-none text-black text-xl placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-3xl text-lg font-semibold transition">
              Kërko
            </button>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-4 flex-wrap">
        <select 
          className="border border-gray-300 rounded-2xl px-6 py-4 text-lg"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Të gjitha kategoritë</option>
          <option value="Teknologji">Teknologji</option>
          <option value="Muzikë">Muzikë</option>
          <option value="Sport">Sport</option>
        </select>

        <button className="flex items-center gap-3 border border-gray-300 rounded-2xl px-6 py-4 hover:bg-gray-100 text-lg">
          <Calendar size={24} /> Data
        </button>
        <button className="flex items-center gap-3 border border-gray-300 rounded-2xl px-6 py-4 hover:bg-gray-100 text-lg">
          <MapPin size={24} /> Vendndodhja
        </button>
      </div>

      {/* EVENT LIST */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-4xl font-semibold mb-8">Eventet e ardhshme ({filteredEvents.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}