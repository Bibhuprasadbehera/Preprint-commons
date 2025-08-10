import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import Explore from './pages/Explore';
import Paper from './pages/Paper';
import Documentation from './pages/Documentation';
import CitationScatterChart from './components/charts/CitationScatterChart';
import Card from './components/ui/Card/Card';
import Header from './components/ui/Header/Header';
import FilterControls from './components/ui/FilterControls/FilterControls';
import Layout from './components/layout/Layout/Layout';
import { useUnifiedCitationData } from './hooks/useUnifiedCitationData';
import './index.css';

// Mock data for demonstration
const mockCitationData = [
  {
    PPC_Id: "1",
    preprint_title: "Advanced Machine Learning Techniques in Bioinformatics",
    publication_date: "2020-03-15",
    total_citation: 45,
    all_authors: [{"author_name": "Dr. Sarah Johnson"}, {"author_name": "Prof. Michael Chen"}]
  },
  {
    PPC_Id: "2", 
    preprint_title: "Novel Approaches to Gene Expression Analysis",
    publication_date: "2021-07-22",
    total_citation: 32,
    all_authors: [{"author_name": "Dr. Emily Rodriguez"}, {"author_name": "Dr. James Wilson"}]
  },
  {
    PPC_Id: "3",
    preprint_title: "Deep Learning for Protein Structure Prediction",
    publication_date: "2022-01-10",
    total_citation: 78,
    all_authors: [{"author_name": "Prof. Lisa Zhang"}, {"author_name": "Dr. Robert Kumar"}]
  },
  {
    PPC_Id: "4",
    preprint_title: "CRISPR-Cas9 Applications in Cancer Research",
    publication_date: "2019-11-05",
    total_citation: 156,
    all_authors: [{"author_name": "Dr. Maria Gonzalez"}, {"author_name": "Prof. David Lee"}]
  },
  {
    PPC_Id: "5",
    preprint_title: "Computational Methods for Drug Discovery",
    publication_date: "2023-04-18",
    total_citation: 23,
    all_authors: [{"author_name": "Dr. Alex Thompson"}, {"author_name": "Dr. Nina Patel"}]
  }
];

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
        <a href="/documentation" style={{ padding: '0.5rem 1rem', background: '#9b59b6', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
          Documentation
        </a>
        <a href="/citation-demo" style={{ padding: '0.5rem 1rem', background: '#f39c12', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
          Citation Analysis Demo
        </a>
      </div>
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>✨ Key Improvements:</h3>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li><strong>Consolidated Code:</strong> Removed duplicate utilities and hooks</li>
          <li><strong>Modular CSS:</strong> Converted standalone CSS to CSS modules</li>
          <li><strong>Unified API:</strong> Single source for API utilities and data fetching</li>
          <li><strong>Clean Architecture:</strong> Better organized components and utilities</li>
          <li><strong>Demo Integration:</strong> All demos accessible from single entry point</li>
        </ul>
      </div>
    </div>
  </Layout>
);

// Citation Analysis Demo Component
const CitationAnalysisDemo = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [sortOption, setSortOption] = useState('citations_desc');
  const [useMockData, setUseMockData] = useState(true);

  const { data, loading, error, fetchAllData } = useUnifiedCitationData();

  const handleSearchClick = () => {
    if (useMockData) {
      return;
    }
    fetchAllData(selectedTimeRange, selectedSubject, sortOption, 10);
  };

  const handleRefreshData = () => {
    if (useMockData) {
      setUseMockData(false);
      setTimeout(() => setUseMockData(true), 1000);
      return;
    }
    fetchAllData(selectedTimeRange, selectedSubject, sortOption, 10);
  };

  const handleExportData = () => {
    const exportData = {
      filters: {
        timeRange: selectedTimeRange,
        subject: selectedSubject,
        sortOption: sortOption
      },
      data: useMockData ? mockCitationData : data.impactData
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `citation-scatter-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const displayData = useMockData ? mockCitationData : data.impactData;
  const isLoading = useMockData ? false : loading.impactData;
  const hasError = useMockData ? null : error.impactData;

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-secondary)', minHeight: '100vh' }}>
      <div className="container">
        <Header
          title="Enhanced Citation Impact Scatter Plot"
          subtitle="Interactive visualization with zoom controls and unified data fetching"
          variant="page"
          size="large"
        />

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <input
              type="checkbox"
              checked={useMockData}
              onChange={(e) => setUseMockData(e.target.checked)}
            />
            <span>Use mock data for demonstration</span>
          </label>

          <FilterControls
            selectedTimeRange={selectedTimeRange}
            selectedSubject={selectedSubject}
            sortOption={sortOption}
            onTimeRangeChange={setSelectedTimeRange}
            onSubjectChange={setSelectedSubject}
            onSortChange={setSortOption}
            onSearchClick={handleSearchClick}
            onExportData={handleExportData}
            onRefreshData={handleRefreshData}
            isSearching={isLoading}
          />
        </div>

        <Card style={{ marginBottom: '24px' }}>
          <Card.Header>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
              Citation Impact Visualization
            </h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              Publication Year vs Citations with Interactive Zoom Controls
            </p>
          </Card.Header>
          <Card.Content>
            <CitationScatterChart 
              data={displayData} 
              loading={isLoading} 
            />
            {hasError && (
              <div style={{ 
                color: 'var(--color-error)', 
                padding: '12px', 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '8px',
                marginTop: '16px'
              }}>
                Error: {hasError}
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/paper/:id" element={<Paper />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/citation-demo" element={<CitationAnalysisDemo />} />
        <Route path="/demo" element={<DemoNav />} />
        <Route path="*" element={<DemoNav />} />
      </Routes>
    </Router>
  );
};

export default App;