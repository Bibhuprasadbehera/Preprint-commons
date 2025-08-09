import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Explore from './pages/Explore';
import Paper from './pages/Paper';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/paper/:id" element={<Paper />} />
        <Route path="*" element={<Explore />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;