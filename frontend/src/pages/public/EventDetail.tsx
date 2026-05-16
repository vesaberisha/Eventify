import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { resolveEventImageUrl } from '../../utils/eventUtils';
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading event...</div>;
  if (!event) return <div className="text-center py-20">Event not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <button 
          onClick={() => navigate('/events')}
          className="mb-6 text-indigo-600 hover:underline flex items-center gap-2"
        >
          ← Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <img
              src={resolveEventImageUrl(event)}
              alt=""
              className="w-full rounded-3xl shadow-2xl object-cover bg-gray-200"
            />
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                {new Date(event.startDate).toLocaleDateString('sq-AL')}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                {event.venue?.name} - {event.venue?.address}
              </div>
            </div>

            <div className="text-5xl font-bold text-emerald-600 mb-8">
              {event.price ? `${event.price} €` : 'Falas'}
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-10">
              {event.description}
            </p>

            <button 
              onClick={() => navigate(`/booking/${event.id}`)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl text-xl font-semibold transition"
            >
              Rezervo Tani
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}