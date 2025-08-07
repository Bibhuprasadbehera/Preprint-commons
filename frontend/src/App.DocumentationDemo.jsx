import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Documentation from './pages/Documentation';
import Index from './pages/Index';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Documentation />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/home" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Documentation />} />
      </Routes>
    </Router>
  );
}

export default App;