import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Paper from './pages/Paper';
import Explore from './pages/Explore';
import Layout from './components/layout/Layout/Layout';

// Mock components for demo
const Home = () => (
  <Layout>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Preprint Commons Demo</h1>
      <p>Navigate to /explore to see the improved search functionality</p>
      <p>Navigate to /paper/PPC00000001 to see the improved paper page</p>
    </div>
  </Layout>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/paper/:id" element={<Paper />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;