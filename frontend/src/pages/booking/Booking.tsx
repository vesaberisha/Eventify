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
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Duhet të jeni të kyçur për të rezervuar.');
      return;
    }

    api
      .get(`/api/events/${eventId}`)
      .then((res) => setEvent(res.data))
      .catch(() => setError('Nuk u ngarkua eventi. Provoni përsëri.'));
  }, [eventId]);

  const ticketTypes = event?.ticketTypes ?? [];
  const hasTicketTypes = ticketTypes.length > 0;

  const handleBooking = async () => {
    setError('');

    if (!localStorage.getItem('accessToken')) {
      setError('Duhet të jeni të kyçur. Shkoni te Login.');
      return;
    }

    if (!hasTicketTypes) {
      setError('Ky event nuk ka lloje biletash të disponueshme.');
      return;
    }

    if (!selectedTicket) {
      setError('Zgjidhni një lloj bilete.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/bookings', {
        eventId,
        ticketTypeId: selectedTicket,
        quantity,
      });

      const paymentRes = await api.post('/api/payments/create-checkout-session', {
        bookingId: res.data.id,
      });

      const checkoutUrl = paymentRes.data?.url;
      if (!checkoutUrl) {
        throw new Error('Nuk u krijua lidhja e pagesës. Kontrolloni konfigurimin e Stripe.');
      }

      window.location.href = checkoutUrl;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Diçka shkoi keq gjatë rezervimit.';
      console.error('Rezervim/pagesë:', err.response?.data || err.message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!event && !error) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-3xl font-bold mb-8">
          Rezervo - {event?.title ?? 'Event'}
        </h1>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            {error}
            {error.includes('kyçur') && (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="block mt-2 text-indigo-600 font-medium hover:underline"
              >
                Shko te Login →
              </button>
            )}
          </div>
        )}

        {!hasTicketTypes && event && (
          <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6">
            Ky event nuk ka bileta të konfiguruara ende. Kontaktoni organizatorin.
          </p>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Lloji i Biletës</label>
            <select
              className="w-full p-4 border rounded-2xl"
              value={selectedTicket}
              onChange={(e) => setSelectedTicket(e.target.value)}
              disabled={!hasTicketTypes}
            >
              <option value="">Zgjidh llojin e biletës</option>
              {ticketTypes.map((tt) => (
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
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full p-4 border rounded-2xl"
            />
          </div>

          <button
            onClick={handleBooking}
            disabled={loading || !hasTicketTypes || !selectedTicket}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-5 rounded-2xl text-xl font-semibold"
          >
            {loading ? 'Po përpunohet...' : 'Konfirmo Rezervimin'}
          </button>
        </div>
      </div>
    </div>
  );
}
