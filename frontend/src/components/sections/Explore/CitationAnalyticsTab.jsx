import React from 'react';
import Header from '../../ui/Header/Header';
import FilterControls from '../../ui/FilterControls/FilterControls';
import Card from '../../ui/Card/Card';
import CitationScatterChart from '../../citationCharts/CitationScatterChart';
import CitationTrendsChart from '../../citationCharts/CitationTrendsChart';
import CitationHeatmap from '../../citationCharts/CitationHeatmap';
import PapersList from '../../ui/PapersList/PapersList';
import DynamicSectionTitle from '../../ui/DynamicSectionTitle/DynamicSectionTitle';
import { useCitationAnalytics } from '../../../hooks/useCitationAnalytics';
import styles from '../../../pages/ExplorePage.module.css';
import layoutStyles from '../../layout/Layout/Layout.module.css';

const CitationAnalyticsTab = () => {
  const {
    selectedTimeRange,
    setSelectedTimeRange,
    selectedSubject,
    setSelectedSubject,
    selectedCountry,
    setSelectedCountry,
    sortOption,
    setSortOption,
    isSearching,
    handleSearchClick,
    handleExportData,
    handleRefreshData,
    citationData,
    citationLoading,
    citationError,
  } = useCitationAnalytics();

  const { impactData, trendsData, heatmapData, topPapersData } = citationData;
  const { impactData: impactLoading, trendsData: trendsLoading, heatmapData: heatmapLoading, topPapersData: papersLoading } = citationLoading;
  const { impactData: impactError, trendsData: trendsError, heatmapData: heatmapError, topPapersData: papersError } = citationError;

  return (
    <div className="container">
      <div className={layoutStyles.contentSection}>
        <Header 
          title="Citation Analytics Dashboard"
          subtitle="Set your filters and click 'Search & Analyze' to explore research impact and citation patterns through interactive visualizations."
          variant="section"
          size="medium"
        />

        <FilterControls
          selectedTimeRange={selectedTimeRange}
          selectedSubject={selectedSubject}
          selectedCountry={selectedCountry}
          sortOption={sortOption}
          onTimeRangeChange={setSelectedTimeRange}
          onSubjectChange={setSelectedSubject}
          onCountryChange={setSelectedCountry}
          onSortChange={setSortOption}
          onSearchClick={handleSearchClick}
          onExportData={handleExportData}
          onRefreshData={handleRefreshData}
          isSearching={isSearching}
        />

        <div className={styles.chartsGrid}>
          <Card className={styles.chartCard}>
            <Card.Header>
              <h3 className={styles.chartTitle}>Citation Impact Visualization</h3>
              <p className={styles.chartSubtitle}>Publication Date vs Citations</p>
            </Card.Header>
            <Card.Content>
              <CitationScatterChart data={impactData} loading={impactLoading} />
              {impactError && (
                <div className={styles.error}>
                  Error: {impactError}
                  <span className={styles.retryInfo}> (Auto-retrying...)</span>
                </div>
              )}
            </Card.Content>
          </Card>

          <Card className={styles.chartCard}>
            <Card.Header>
              <h3 className={styles.chartTitle}>Citation Trends Over Time</h3>
              <p className={styles.chartSubtitle}>Citation Accumulation</p>
            </Card.Header>
            <Card.Content>
              <CitationTrendsChart data={trendsData} loading={trendsLoading} />
              {trendsError && (
                <div className={styles.error}>
                  Error: {trendsError}
                  <span className={styles.retryInfo}> (Auto-retrying...)</span>
                </div>
              )}
            </Card.Content>
          </Card>

          <Card className={styles.chartCard}>
            <Card.Header>
              <h3 className={styles.chartTitle}>Citation Heatmap</h3>
              <p className={styles.chartSubtitle}>Citation Patterns by Year</p>
            </Card.Header>
            <Card.Content>
              <CitationHeatmap data={heatmapData} loading={heatmapLoading} />
              {heatmapError && (
                <div className={styles.error}>
                  Error: {heatmapError}
                  <span className={styles.retryInfo}> (Auto-retrying...)</span>
                </div>
              )}
            </Card.Content>
          </Card>

          <Card className={styles.chartCard}>
            <Card.Header>
              <DynamicSectionTitle sortOption={sortOption} />
            </Card.Header>
            <Card.Content>
              <PapersList 
                papers={topPapersData} 
                loading={papersLoading}
                onPaperClick={(paper) => console.log('Paper clicked:', paper)}
              />
              {papersError && (
                <div className={styles.error}>
                  Error: {papersError}
                  <span className={styles.retryInfo}> (Auto-retrying...)</span>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CitationAnalyticsTab;
