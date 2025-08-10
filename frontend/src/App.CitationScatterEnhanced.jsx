import React, { useState } from 'react';
import CitationScatterChart from './components/charts/CitationScatterChart';
import Card from './components/ui/Card/Card';
import Header from './components/ui/Header/Header';
import FilterControls from './components/ui/FilterControls/FilterControls';
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
  },
  {
    PPC_Id: "6",
    preprint_title: "Single-Cell RNA Sequencing Analysis Pipeline",
    publication_date: "2020-09-12",
    total_citation: 67,
    all_authors: [{"author_name": "Prof. Jennifer Kim"}, {"author_name": "Dr. Mark Anderson"}]
  },
  {
    PPC_Id: "7",
    preprint_title: "AI-Driven Personalized Medicine Approaches",
    publication_date: "2021-12-03",
    total_citation: 89,
    all_authors: [{"author_name": "Dr. Rachel Brown"}, {"author_name": "Prof. Steven Davis"}]
  },
  {
    PPC_Id: "8",
    preprint_title: "Quantum Computing Applications in Molecular Modeling",
    publication_date: "2022-08-25",
    total_citation: 41,
    all_authors: [{"author_name": "Dr. Kevin Liu"}, {"author_name": "Dr. Amanda White"}]
  },
  {
    PPC_Id: "9",
    preprint_title: "Blockchain Technology in Healthcare Data Management",
    publication_date: "2023-02-14",
    total_citation: 15,
    all_authors: [{"author_name": "Prof. Daniel Miller"}, {"author_name": "Dr. Sophie Taylor"}]
  },
  {
    PPC_Id: "10",
    preprint_title: "Immunotherapy Optimization Using Machine Learning",
    publication_date: "2019-06-30",
    total_citation: 134,
    all_authors: [{"author_name": "Dr. Carlos Rodriguez"}, {"author_name": "Prof. Helen Chang"}]
  }
];

const App = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [sortOption, setSortOption] = useState('citations_desc');
  const [useMockData, setUseMockData] = useState(true);

  const { data, loading, error, fetchAllData } = useUnifiedCitationData();

  const handleSearchClick = () => {
    if (useMockData) {
      // Use mock data for demonstration
      return;
    }
    fetchAllData(selectedTimeRange, selectedSubject, sortOption, 10);
  };

  const handleRefreshData = () => {
    if (useMockData) {
      // Simulate refresh with mock data
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

        <Card>
          <Card.Header>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>
              Features Demonstrated
            </h3>
          </Card.Header>
          <Card.Content>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>Unified Data Fetching:</strong> Single hook manages all citation data consistently</li>
              <li><strong>Year-Only Display:</strong> X-axis shows only publication years for clarity</li>
              <li><strong>Interactive Zoom Controls:</strong> Zoom in/out buttons and reset functionality</li>
              <li><strong>Mouse/Touch Zoom:</strong> Ctrl+scroll wheel and pinch gestures for zooming</li>
              <li><strong>Year Range Indicator:</strong> Shows current zoom range when zoomed</li>
              <li><strong>Responsive Design:</strong> Adapts to different screen sizes</li>
              <li><strong>Enhanced Tooltips:</strong> Rich hover information for each data point</li>
            </ul>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default App;