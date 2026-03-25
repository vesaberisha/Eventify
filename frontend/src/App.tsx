import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/public/Home';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Këtu do të shtojmë rrugët e tjera më vonë */}
      </Routes>
    </Router>
  );
}

export default App;