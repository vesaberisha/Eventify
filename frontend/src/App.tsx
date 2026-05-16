import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/public/Home';
import Events from './pages/public/Events';
import EventDetail from './pages/public/EventDetail';
import Booking from './pages/booking/Booking';
import Categories from './pages/public/Categories';
import Venues from './pages/public/Venues';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import PaymentSuccess from './pages/booking/Payment';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking/:eventId" element={<Booking />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
<Route path="/payment/cancel" element={<div className="text-center py-20 text-red-600 text-2xl">Pagesa u anulua.</div>} />
      </Routes>
    </Router>
  );
}

export default App;