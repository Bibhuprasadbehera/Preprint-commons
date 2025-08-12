import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Explore from './pages/Explore';
import Documentation from './pages/Documentation';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Index />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;