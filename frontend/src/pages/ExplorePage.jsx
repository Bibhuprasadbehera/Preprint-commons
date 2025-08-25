import React, { useState } from 'react';
import Layout from '../components/layout/Layout/Layout';
import Button from '../components/ui/Button/Button';
import Header from '../components/ui/Header/Header';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard/AnalyticsDashboard';
import MapTab from '../components/sections/Explore/MapTab';
import SearchTab from '../components/sections/Explore/SearchTab';
import AuthorsTab from '../components/sections/Explore/AuthorsTab';
import CitationAnalyticsTab from '../components/sections/Explore/CitationAnalyticsTab';
import SubjectAnalysisTab from '../components/sections/Explore/SubjectAnalysisTab';
import styles from './ExplorePage.module.css';
import layoutStyles from '../components/layout/Layout/Layout.module.css';

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('map');

  const openTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <Layout>
      <div className="centered-page">
        <Header 
          title="Explore Preprint Data"
          subtitle="Discover insights through interactive visualizations and comprehensive search capabilities."
          variant="page"
          size="large"
        />
        
        <div className={styles.tabNavigation}>
          <Button
            variant={activeTab === 'map' ? 'primary' : 'outline'}
            onClick={() => openTab('map')}
            className={styles.tabButton}
          >
            Interactive Map
          </Button>
          <Button
            variant={activeTab === 'search' ? 'primary' : 'outline'}
            onClick={() => openTab('search')}
            className={styles.tabButton}
          >
            Search Papers
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'primary' : 'outline'}
            onClick={() => openTab('analytics')}
            className={styles.tabButton}
          >
            Citation Analytics
          </Button>
          <Button
            variant={activeTab === 'authors' ? 'primary' : 'outline'}
            onClick={() => openTab('authors')}
            className={styles.tabButton}
          >
            Search Authors
          </Button>
          <Button
            variant={activeTab === 'dashboard' ? 'primary' : 'outline'}
            onClick={() => openTab('dashboard')}
            className={styles.tabButton}
          >
            Analytics Dashboard
          </Button>
          <Button
            variant={activeTab === 'subjects' ? 'primary' : 'outline'}
            onClick={() => openTab('subjects')}
            className={styles.tabButton}
          >
            Subject Analysis
          </Button>
        </div>
        
        {activeTab === 'map' && <MapTab />}
        {activeTab === 'search' && <SearchTab />}
        {activeTab === 'analytics' && <CitationAnalyticsTab />}
        {activeTab === 'authors' && <AuthorsTab />}
        {activeTab === 'dashboard' && (
          <div className="container">
            <div className={layoutStyles.contentSection}>
              <AnalyticsDashboard />
            </div>
          </div>
        )}
        {activeTab === 'subjects' && <SubjectAnalysisTab activeTab={activeTab} />}
      </div>
    </Layout>
  );
};

export default ExplorePage;
