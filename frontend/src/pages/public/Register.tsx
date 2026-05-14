import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required className="w-full px-4 py-3 border rounded-2xl" />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required className="w-full px-4 py-3 border rounded-2xl" />
          </div>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-3 border rounded-2xl" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full px-4 py-3 border rounded-2xl" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-semibold hover:bg-indigo-700"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6">
          Ke llogari? <Link to="/login" className="text-indigo-600 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}