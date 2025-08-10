import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Explore from './pages/Explore';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="*" element={<Explore />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;