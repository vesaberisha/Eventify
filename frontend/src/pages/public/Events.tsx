import { useState, useEffect } from 'react';
import api from '../../services/api';
import EventCard from '../../components/EventCard';

/** Map API / Prisma event shape to EventCard props */
function toCardEvent(raw: Record<string, unknown>) {
  const venue = raw.venue as { name?: string; address?: string } | undefined;
  const id = raw.id as string | number;
  const start = (raw.startDate as string) || (raw.date as string) || new Date().toISOString();
  return {
    id,
    title: (raw.title as string) || 'Event',
    date: start,
    location: venue ? [venue.name, venue.address].filter(Boolean).join(', ') : '—',
    price: typeof raw.price === 'number' ? raw.price : 0,
    image:
      (raw.image as string) ||
      `https://picsum.photos/seed/${encodeURIComponent(String(id))}/800/600`,
  };
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const trimmed = searchTerm.trim();
        const res = trimmed
          ? await api.get('/api/events/search', { params: { q: trimmed } })
          : await api.get('/api/events', { params: category ? { category } : {} });
        if (!cancelled) setEvents(res.data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [searchTerm, category]);

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">All Events</h1>

        {/* Advanced Search */}
        <div className="bg-white p-6 rounded-3xl shadow mb-10 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search events..."
            className="flex-1 px-6 py-4 border rounded-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-6 py-4 border rounded-2xl"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Teknologji">Teknologji</option>
            <option value="Muzikë">Muzikë</option>
            <option value="Sport">Sport</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <p className="text-gray-600 col-span-full">Loading events…</p>
          ) : events.length === 0 ? (
            <p className="text-gray-600 col-span-full">No events found.</p>
          ) : (
            events.map((event) => (
              <EventCard key={String(event.id)} event={toCardEvent(event as Record<string, unknown>)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}