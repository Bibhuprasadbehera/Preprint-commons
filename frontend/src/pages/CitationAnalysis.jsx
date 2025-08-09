import React, { useState } from 'react';
import Layout from '../components/layout/Layout/Layout';
import Header from '../components/ui/Header/Header';
import Card from '../components/ui/Card/Card';
import FilterControls from '../components/ui/FilterControls/FilterControls';
import CitationScatterChart from '../components/charts/CitationScatterChart';
import CitationTrendsChart from '../components/charts/CitationTrendsChart';
import CitationHeatmap from '../components/charts/CitationHeatmap';
import PapersList from '../components/ui/PapersList/PapersList';
import { 
  useCitationImpactData, 
  useCitationTrendsData, 
  useCitationHeatmapData, 
  useTopCitedPapersData 
} from '../hooks/useCitationData';
import styles from './CitationAnalysis.module.css';

const CitationAnalysis = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [sortOption, setSortOption] = useState('citations_desc');

  // Fetch data using custom hooks
  const { data: impactData, loading: impactLoading, error: impactError } = useCitationImpactData(selectedTimeRange, selectedSubject);
  const { data: trendsData, loading: trendsLoading, error: trendsError } = useCitationTrendsData(selectedTimeRange, selectedSubject);
  const { data: heatmapData, loading: heatmapLoading, error: heatmapError } = useCitationHeatmapData(selectedTimeRange);
  const { data: topPapersData, loading: papersLoading, error: papersError } = useTopCitedPapersData(10, sortOption, selectedTimeRange, selectedSubject);

  const handleExportData = () => {
    const exportData = {
      impactData,
      trendsData,
      heatmapData,
      topPapersData
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `citation-analysis-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleRefreshData = () => {
    // Force re-fetch by updating state
    window.location.reload();
  };

  const handlePaperClick = (paper) => {
    console.log('Paper clicked:', paper);
    // Navigation is handled by the PapersList component
  };

  return (
    <Layout>
      <div className={styles.citationAnalysis}>
        <Header
          title="Citation Analysis Dashboard"
          subtitle="Analyze research impact and citation patterns"
          variant="page"
          size="large"
        />

        <FilterControls
          selectedTimeRange={selectedTimeRange}
          selectedSubject={selectedSubject}
          sortOption={sortOption}
          onTimeRangeChange={setSelectedTimeRange}
          onSubjectChange={setSelectedSubject}
          onSortChange={setSortOption}
          onExportData={handleExportData}
          onRefreshData={handleRefreshData}
        />

        <div className={styles.chartsGrid}>
          <Card className={styles.chartCard}>
            <Card.Header>
              <h3 className={styles.chartTitle}>Citation Impact Visualization</h3>
              <p className={styles.chartSubtitle}>Publication Date vs Citations</p>
            </Card.Header>
            <Card.Content>
              <CitationScatterChart data={impactData} loading={impactLoading} />
              {impactError && <div className={styles.error}>Error: {impactError}</div>}
            </Card.Content>
          </Card>

          <Card className={styles.chartCard}>
            <Card.Header>
              <h3 className={styles.chartTitle}>Citation Trends Over Time</h3>
              <p className={styles.chartSubtitle}>Citation Accumulation</p>
            </Card.Header>
            <Card.Content>
              <CitationTrendsChart data={trendsData} loading={trendsLoading} />
              {trendsError && <div className={styles.error}>Error: {trendsError}</div>}
            </Card.Content>
          </Card>

          <Card className={styles.chartCard}>
            <Card.Header>
              <h3 className={styles.chartTitle}>Citation Heatmap</h3>
              <p className={styles.chartSubtitle}>Citation Patterns by Year</p>
            </Card.Header>
            <Card.Content>
              <CitationHeatmap data={heatmapData} loading={heatmapLoading} />
              {heatmapError && <div className={styles.error}>Error: {heatmapError}</div>}
            </Card.Content>
          </Card>

          <Card className={styles.chartCard}>
            <Card.Header>
              <h3 className={styles.chartTitle}>High-Impact Papers</h3>
              <p className={styles.chartSubtitle}>Top Cited Papers</p>
            </Card.Header>
            <Card.Content>
              <PapersList 
                papers={topPapersData} 
                loading={papersLoading}
                onPaperClick={handlePaperClick}
              />
              {papersError && <div className={styles.error}>Error: {papersError}</div>}
            </Card.Content>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CitationAnalysis;