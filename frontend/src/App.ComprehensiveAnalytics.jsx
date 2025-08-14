import React from 'react';
import Layout from './components/layout/Layout/Layout';
import ComprehensiveAnalyticsDashboard from './components/analytics/ComprehensiveAnalyticsDashboard/ComprehensiveAnalyticsDashboard';

const App = () => {
  return (
    <Layout>
      <div className="centered-page">
        <div className="container">
          <ComprehensiveAnalyticsDashboard />
        </div>
      </div>
    </Layout>
  );
};

export default App;