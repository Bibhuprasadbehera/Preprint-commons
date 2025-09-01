import React from 'react';
import AuthorAnalyticsCharts from './components/authorAnalytics/AuthorAnalyticsCharts';
import { mockScatterData, mockTimelineData, mockSubjectData, mockRootProps } from './components/authorAnalytics/authorAnalyticsMockData';

const App = () => {
  // Mock author results data
  const mockAuthorResults = [
    { author_name: "Dr. Sarah Chen", paper_count: 15, max_citations: 89, submission_contact: "s.chen@mit.edu" },
    { author_name: "Prof. Michael Rodriguez", paper_count: 23, max_citations: 156, submission_contact: "m.rodriguez@stanford.edu" },
    { author_name: "Dr. Emily Watson", paper_count: 8, max_citations: 45, submission_contact: "e.watson@oxford.ac.uk" },
    { author_name: "Dr. Alex Kumar", paper_count: 31, max_citations: 203, submission_contact: "a.kumar@ibm.com" },
    { author_name: "Prof. Lisa Zhang", paper_count: 19, max_citations: 112, submission_contact: "l.zhang@toronto.ca" },
    { author_name: "Dr. Maria Gonzalez", paper_count: 12, max_citations: 67, submission_contact: "m.gonzalez@harvard.edu" },
    { author_name: "Dr. James Wilson", paper_count: 27, max_citations: 178, submission_contact: "j.wilson@jhu.edu" },
    { author_name: "Prof. Anna Petrov", paper_count: 6, max_citations: 32, submission_contact: "a.petrov@cam.ac.uk" },
    { author_name: "Dr. Robert Kim", paper_count: 41, max_citations: 287, submission_contact: "r.kim@kaist.ac.kr" },
    { author_name: "Dr. Sophie Martin", paper_count: 16, max_citations: 94, submission_contact: "s.martin@sorbonne.fr" }
  ];

  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          color: '#1e293b',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          Author Analytics Dashboard
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#64748b',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          Interactive charts showing author research metrics and insights
        </p>
        
        <AuthorAnalyticsCharts 
          authorQuery="machine learning"
          authorResults={mockAuthorResults}
          showAnalytics={true}
          isLoading={false}
          error={null}
          onRefreshData={() => console.log('Refreshing data...')}
          maxAuthors={50}
        />
      </div>
    </div>
  );
};

export default App;