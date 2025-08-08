import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Paper from './pages/Paper';
import Explore from './pages/Explore';
import Layout from './components/layout/Layout/Layout';
import Header from './components/ui/Header/Header';

// Demo navigation component
const DemoNav = () => (
  <Layout>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Header 
        title="Preprint Commons Demo"
        subtitle="Explore the improved styling and functionality across all pages"
        variant="page"
        size="large"
      />
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
        <a href="/" style={{ padding: '0.5rem 1rem', background: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
          Homepage (with Map)
        </a>
        <a href="/explore" style={{ padding: '0.5rem 1rem', background: '#e74c3c', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
          Explore (Search & Map)
        </a>
        <a href="/paper/PPC00000001" style={{ padding: '0.5rem 1rem', background: '#2ecc71', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
          Paper Details
        </a>
      </div>
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>✨ Key Improvements:</h3>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li><strong>Consistent Map Component:</strong> No internal scrolling, proper aspect ratios</li>
          <li><strong>Enhanced Search:</strong> Pagination with 100-item limit</li>
          <li><strong>Better Paper Pages:</strong> Modern layout with improved metadata display</li>
          <li><strong>Responsive Design:</strong> Works perfectly on all device sizes</li>
          <li><strong>Reusable Components:</strong> MapContainer, PageHeader, SearchBar, etc.</li>
        </ul>
      </div>
    </div>
  </Layout>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/paper/:id" element={<Paper />} />
        <Route path="/demo" element={<DemoNav />} />
        <Route path="*" element={<DemoNav />} />
      </Routes>
    </Router>
  );
};

export default App;