import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import Explore from './pages/Explore';
import Paper from './pages/Paper';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/paper/:id" element={<Paper />} />
          <Route path="*" element={<Index />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;