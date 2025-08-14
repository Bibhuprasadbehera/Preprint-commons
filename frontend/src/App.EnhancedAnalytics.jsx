import React from 'react';
import Layout from './components/layout/Layout/Layout';
import Header from './components/ui/Header/Header';
import AuthorAnalyticsCard from './components/analytics/AuthorAnalyticsCard/AuthorAnalyticsCard';
import SubjectAnalyticsCard from './components/analytics/SubjectAnalyticsCard/SubjectAnalyticsCard';
import GeographicAnalyticsCard from './components/analytics/GeographicAnalyticsCard/GeographicAnalyticsCard';
import EnhancedFilterControls from './components/analytics/EnhancedFilterControls/EnhancedFilterControls';
import { mockEnhancedAnalytics } from './components/analytics/EnhancedAnalyticsMockData';

const App = () => {
  const { authorAnalytics, enhancedSubjectAnalysis, geographicAnalytics } = mockEnhancedAnalytics;

  const handleSearchClick = () => {
    console.log('Search clicked');
  };

  const handleExportData = () => {
    console.log('Export clicked');
  };

  const handleRefreshData = () => {
    console.log('Refresh clicked');
  };

  return (
    <Layout>
      <div className="centered-page">
        <Header 
          title="Enhanced Citation Analytics"
          subtitle="Phase 1 implementation featuring Author Analytics, Subject Analysis, and Geographic Patterns with modern UI components and interactive visualizations."
          variant="page"
          size="large"
        />
        
        <div className="container">
          <EnhancedFilterControls
            selectedTimeRange="all"
            selectedSubject={null}
            selectedCountry={null}
            sortOption="citations_desc"
            onTimeRangeChange={() => {}}
            onSubjectChange={() => {}}
            onCountryChange={() => {}}
            onSortChange={() => {}}
            onSearchClick={handleSearchClick}
            onExportData={handleExportData}
            onRefreshData={handleRefreshData}
            isSearching={false}
          />

          <div className="analytics-enhanced-grid">
            <AuthorAnalyticsCard 
              data={authorAnalytics} 
              loading={false}
            />
            
            <SubjectAnalyticsCard 
              data={enhancedSubjectAnalysis} 
              loading={false}
            />
            
            <GeographicAnalyticsCard 
              data={geographicAnalytics} 
              loading={false}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;