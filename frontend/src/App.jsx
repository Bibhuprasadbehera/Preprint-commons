import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import Explore from './pages/Explore';
import Paper from './pages/Paper';
import Documentation from './pages/Documentation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/paper/:id" element={<Paper />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="*" element={<Index />} />
    </Routes>
  );
}

export default App;