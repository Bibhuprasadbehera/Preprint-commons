import React, { useEffect, useState } from 'react';
import Card from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import StatisticsCard from '../StatisticsCard/StatisticsCard';
import PublicationTimelineChart from '../../analyticsCharts/PublicationTimelineChart';
import SubjectDistributionChart from '../../analyticsCharts/SubjectDistributionChart';
import ServerDistributionChart from '../../analyticsCharts/ServerDistributionChart';
import PublicationTimelineAdvancedChart from '../PublicationTimelineChart';
import LicenseAnalyticsChart from '../LicenseAnalyticsChart';
import PublicationStatusChart from '../PublicationStatusChart';
import PapersList from '../../ui/PapersList/PapersList';
import { useAnalyticsData } from '../../../hooks/useAnalyticsData';
import { formatDateRange } from '../AnalyticsDashboardMockData';
import ApiService from '../../../services/api';
import styles from './AnalyticsDashboard.module.css';

const AnalyticsDashboard = () => {
  const { data, loading, error, fetchAnalyticsData, retryCount } = useAnalyticsData();
  const { timelineData, subjectData, serverData, statisticsData } = data;

  // Advanced analytics state
  const [publicationTimelineData, setPublicationTimelineData] = useState(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [licenseData, setLicenseData] = useState(null);
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [publicationStatusData, setPublicationStatusData] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchAnalyticsData();
    fetchPublicationTimeline();
    fetchLicenseAnalytics();
    fetchPublicationStatus();
  }, [fetchAnalyticsData]);

  const fetchPublicationTimeline = async () => {
    setTimelineLoading(true);
    try {
      const data = await ApiService.getPublicationTimeline({});
      setPublicationTimelineData(data);
    } catch (err) {
      console.error('Error fetching publication timeline:', err);
    } finally {
      setTimelineLoading(false);
    }
  };

  const fetchLicenseAnalytics = async () => {
    setLicenseLoading(true);
    try {
      const data = await ApiService.getLicenseAnalytics({});
      setLicenseData(data);
    } catch (err) {
      console.error('Error fetching license analytics:', err);
    } finally {
      setLicenseLoading(false);
    }
  };

  const fetchPublicationStatus = async () => {
    setStatusLoading(true);
    try {
      const data = await ApiService.getPublicationStatus({});
      setPublicationStatusData(data);
    } catch (err) {
      console.error('Error fetching publication status:', err);
    } finally {
      setStatusLoading(false);
    }
  };

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

        {/* Publication Timeline Analytics */}
        {publicationTimelineData && publicationTimelineData.statistics && (
          <>
            <Card className={styles.fullWidthCard}>
              <Card.Header>
                <h3 className={styles.chartTitle}>Publication Timeline Metrics</h3>
                <p className={styles.chartSubtitle}>Average time from preprint to publication</p>
              </Card.Header>
              <Card.Content>
                <div className={styles.statsRow}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total Published</span>
                    <span className={styles.statValue}>{publicationTimelineData.statistics.total_published || 0}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Avg Days to Publish</span>
                    <span className={styles.statValue}>{publicationTimelineData.statistics.overall_avg_days || 0} days</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Fastest Publication</span>
                    <span className={styles.statValue}>{publicationTimelineData.statistics.fastest_publish || 0} days</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Slowest Publication</span>
                    <span className={styles.statValue}>{publicationTimelineData.statistics.slowest_publish || 0} days</span>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card className={styles.chartCard}>
              <Card.Header>
                <h3 className={styles.chartTitle}>Publication Timeline Trend</h3>
                <p className={styles.chartSubtitle}>Average days to publish over time</p>
              </Card.Header>
              <Card.Content>
                <PublicationTimelineAdvancedChart data={publicationTimelineData} type="trend" />
              </Card.Content>
            </Card>

            <Card className={styles.chartCard}>
              <Card.Header>
                <h3 className={styles.chartTitle}>Publication Time Distribution</h3>
                <p className={styles.chartSubtitle}>How long papers take to get published</p>
              </Card.Header>
              <Card.Content>
                <PublicationTimelineAdvancedChart data={publicationTimelineData} type="distribution" />
              </Card.Content>
            </Card>
          </>
        )}

        {/* License Analytics */}
        {licenseData && (
          <>
            <Card className={styles.chartCard}>
              <Card.Header>
                <h3 className={styles.chartTitle}>License Distribution</h3>
                <p className={styles.chartSubtitle}>Distribution of licenses across preprints</p>
              </Card.Header>
              <Card.Content>
                <LicenseAnalyticsChart data={licenseData} type="distribution" />
              </Card.Content>
            </Card>
          </>
        )}

        {/* Publication Status Analytics */}
        {publicationStatusData && (
          <>
            {publicationStatusData.overallRate && (
              <Card className={styles.fullWidthCard}>
                <Card.Header>
                  <h3 className={styles.chartTitle}>Publication Status Overview</h3>
                  <p className={styles.chartSubtitle}>Publication success rates and patterns</p>
                </Card.Header>
                <Card.Content>
                  <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Total Preprints</span>
                      <span className={styles.statValue}>{publicationStatusData.overallRate.total_preprints || 0}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Published</span>
                      <span className={styles.statValue}>{publicationStatusData.overallRate.published_count || 0}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Publication Rate</span>
                      <span className={styles.statValue}>{publicationStatusData.overallRate.publication_rate || 0}%</span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            )}

            <Card className={styles.chartCard}>
              <Card.Header>
                <h3 className={styles.chartTitle}>Publication Rate by Subject</h3>
                <p className={styles.chartSubtitle}>Which subjects have highest publication success</p>
              </Card.Header>
              <Card.Content>
                <PublicationStatusChart data={publicationStatusData} type="subject" />
              </Card.Content>
            </Card>

            <Card className={styles.chartCard}>
              <Card.Header>
                <h3 className={styles.chartTitle}>Publication Status Trend</h3>
                <p className={styles.chartSubtitle}>How publication rates have changed over time</p>
              </Card.Header>
              <Card.Content>
                <PublicationStatusChart data={publicationStatusData} type="trend" />
              </Card.Content>
            </Card>


          </>
        )}

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
