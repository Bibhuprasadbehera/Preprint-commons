import React, { useEffect } from 'react';
import Card from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import StatisticsCard from '../StatisticsCard/StatisticsCard';
import PublicationTimelineChart from '../../analyticsCharts/PublicationTimelineChart';
import SubjectDistributionChart from '../../analyticsCharts/SubjectDistributionChart';
import ServerDistributionChart from '../../analyticsCharts/ServerDistributionChart';
import { useAnalyticsData } from '../../../hooks/useAnalyticsData';
import { formatDateRange } from '../AnalyticsDashboardMockData';
import styles from './AnalyticsDashboard.module.css';

const AnalyticsDashboard = () => {
  const { data, loading, error, fetchAnalyticsData, retryCount } = useAnalyticsData();
  const { timelineData, subjectData, serverData, statisticsData } = data;

  // Fetch data on component mount
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleRefreshData = () => {
    fetchAnalyticsData();
  };

  const handleExportData = () => {
    const exportData = {
      timelineData,
      subjectData,
      serverData,
      statisticsData,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analytics-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Show error state if there's an error and no data
  if (error && !statisticsData) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Failed to Load Analytics Data</h3>
          <p className={styles.errorMessage}>{error}</p>
          <Button
            variant="primary"
            onClick={handleRefreshData}
            loading={loading}
            className={styles.retryButton}
          >
            Retry ({retryCount > 0 ? `Attempt ${retryCount + 1}` : 'Try Again'})
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Dashboard Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.dashboardTitle}>Analytics Dashboard</h2>
          <p className={styles.dashboardSubtitle}>
            Comprehensive overview of publication trends, subject distribution, and server metrics
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            variant="outline"
            size="small"
            onClick={handleRefreshData}
            loading={loading}
            className={styles.actionButton}
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={handleExportData}
            className={styles.actionButton}
          >
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className={styles.statisticsGrid}>
        <StatisticsCard
          title="Total Preprints"
          value={statisticsData?.totalPapers || 0}
          subtitle="All time submissions"
          variant="primary"
        />
        <StatisticsCard
          title="Date Range"
          value={statisticsData?.dateRange ? formatDateRange(statisticsData.dateRange.startDate, statisticsData.dateRange.endDate) : 'N/A'}
          subtitle="Coverage period"
          variant="info"
        />
        <StatisticsCard
          title="Most Active Period"
          value={statisticsData?.mostActivePeriod?.count || 0}
          subtitle={`${statisticsData?.mostActivePeriod?.period || 'N/A'} submissions`}
          variant="success"
        />
        <StatisticsCard
          title="Avg Preprints/Month"
          value={statisticsData?.averagePapersPerMonth || 0}
          subtitle="Monthly average"
          variant="warning"
        />
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        {/* Publication Timeline Chart */}
        <Card className={styles.chartCard}>
          <Card.Header>
            <h3 className={styles.chartTitle}>Publication Timeline</h3>
            <p className={styles.chartSubtitle}>Submissions Over Time</p>
          </Card.Header>
          <Card.Content>
            <PublicationTimelineChart data={timelineData} loading={loading} />
          </Card.Content>
        </Card>

        {/* Subject Distribution Chart */}
        <Card className={styles.chartCard}>
          <Card.Header>
            <h3 className={styles.chartTitle}>Top 10 Subject Distribution</h3>
            <p className={styles.chartSubtitle}>Research Areas</p>
          </Card.Header>
          <Card.Content>
            <SubjectDistributionChart data={subjectData} loading={loading} />
          </Card.Content>
        </Card>

        {/* Server Distribution Chart */}
        <Card className={styles.chartCard}>
          <Card.Header>
            <h3 className={styles.chartTitle}>Server Distribution</h3>
            <p className={styles.chartSubtitle}>Preprint Servers</p>
          </Card.Header>
          <Card.Content>
            <ServerDistributionChart data={serverData} loading={loading} />
          </Card.Content>
        </Card>

        {/* Additional Statistics */}
        <Card className={styles.chartCard}>
          <Card.Header>
            <h3 className={styles.chartTitle}>Additional Metrics</h3>
            <p className={styles.chartSubtitle}>Platform Statistics</p>
          </Card.Header>
          <Card.Content>
            <div className={styles.additionalStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Active Subjects</span>
                <span className={styles.statValue}>{statisticsData?.activeSubjects || 0}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Active Servers</span>
                <span className={styles.statValue}>{statisticsData?.activeServers || 0}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Timeline Records</span>
                <span className={styles.statValue}>{timelineData?.length || 0}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Peak Month</span>
                <span className={styles.statValue}>{statisticsData?.mostActivePeriod?.period || 'N/A'}</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
