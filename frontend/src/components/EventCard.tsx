import { Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

interface EventProps {
  event: {
    id: number | string;
    title: string;
    date: string;
    location: string;
    price: number;
    image: string;
  };
}

export default function EventCard({ event }: EventProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
      <img 
        src={event.image} 
        alt={event.title} 
        className="w-full h-64 object-cover" 
      />
      <div className="p-6">
        <h3 className="font-bold text-2xl mb-3 line-clamp-2">{event.title}</h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Calendar size={20} />
          <span className="text-lg">{new Date(event.date).toLocaleDateString('sq-AL')}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mb-6">
          <MapPin size={20} />
          <span className="text-lg">{event.location}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-3xl font-semibold text-emerald-600">
            <DollarSign size={28} />
            {event.price === 0 ? 'Falas' : `${event.price} €`}
          </div>
          <Link
            to={`/event/${event.id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl text-lg font-medium transition inline-block text-center"
          >
            Detaje
          </Link>
        </div>
      </div>
    </div>
  );
}