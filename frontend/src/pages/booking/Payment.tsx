import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Mund të verifikosh session-in këtu nëse do
      alert("Pagesa u krye me sukses! Faleminderit.");
      navigate('/my-bookings');
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-green-600 mb-4">Pagesa u krye!</h1>
        <p className="text-xl text-gray-600">Biletat tuaja janë rezervuar me sukses.</p>
      </div>
    </div>
  );
}