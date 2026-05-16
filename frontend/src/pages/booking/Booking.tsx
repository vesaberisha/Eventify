import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Booking() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/api/events/${eventId}`).then(res => setEvent(res.data));
  }, [eventId]);

  const handleBooking = async () => {
    if (!selectedTicket) return alert("Zgjidhni një lloj bilete");

    setLoading(true);
    try {
      const res = await api.post('/api/bookings', {
        eventId,
        ticketTypeId: selectedTicket,
        quantity
      });

      alert("Rezervimi u krye me sukses!");
      navigate('/my-bookings'); // do ta krijojmë më vonë
    } catch (err) {
      alert(err.response?.data?.message || "Diçka shkoi keq");
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-3xl font-bold mb-8">Rezervo - {event.title}</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Lloji i Biletës</label>
            <select 
              className="w-full p-4 border rounded-2xl"
              value={selectedTicket}
              onChange={(e) => setSelectedTicket(e.target.value)}
            >
              <option value="">Zgjidh llojin e biletës</option>
              {event.ticketTypes?.map(tt => (
                <option key={tt.id} value={tt.id}>
                  {tt.name} - {tt.price}€
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sasia</label>
            <input 
              type="number" 
              min="1" 
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full p-4 border rounded-2xl"
            />
          </div>

          <button 
            onClick={handleBooking}
            disabled={loading || !selectedTicket}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl text-xl font-semibold"
          >
            {loading ? "Po rezervon..." : "Konfirmo Rezervimin"}
          </button>
        </div>
      </div>
    </div>
  );
}