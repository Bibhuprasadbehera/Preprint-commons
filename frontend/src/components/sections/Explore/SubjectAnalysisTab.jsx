import React from 'react';
import Header from '../../ui/Header/Header';
import FilterControls from '../../ui/FilterControls/FilterControls';
import Card from '../../ui/Card/Card';
import Select from '../../ui/Select/Select';
import { useSubjectAnalysis } from '../../../hooks/useSubjectAnalysis';
import { Line, Bar } from 'react-chartjs-2';
import styles from '../../../pages/ExplorePage.module.css';
import layoutStyles from '../../layout/Layout/Layout.module.css';

const SubjectAnalysisTab = ({ activeTab }) => {
  const {
    selectedTimeRange,
    setSelectedTimeRange,
    selectedSubject,
    setSelectedSubject,
    selectedSubject2,
    setSelectedSubject2,
    subjectOptions,
    subjectsLoading,
    subjectsError,
    subjectAnalysis,
    subjectLoadingLocal,
    subjectErrorLocal,
    isSearching,
    handleSubjectSearchClickLocal,
    handleExportData,
  } = useSubjectAnalysis(activeTab);

  return (
    <div className="container">
      <div className={layoutStyles.contentSection}>
        <Header 
          title="Subject Analysis"
          subtitle="Explore subject evolution, citation ranking by subject, and version distributions. Compare up to two subjects."
          variant="section"
          size="medium"
        />

        <FilterControls
          selectedTimeRange={selectedTimeRange}
          selectedSubject={selectedSubject}
          selectedCountry={null}
          sortOption={'citations_desc'}
          onTimeRangeChange={setSelectedTimeRange}
          onSubjectChange={setSelectedSubject}
          onCountryChange={() => {}}
          onSortChange={() => {}}
          onSearchClick={handleSubjectSearchClickLocal}
          onExportData={handleExportData}
          onRefreshData={handleSubjectSearchClickLocal}
          isSearching={isSearching}
        />

        <div className={styles.searchSection}>
          <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#334155' }}>Compare With (optional)</label>
            <Select
              options={subjectOptions}
              value={selectedSubject2 || ''}
              onChange={(value) => setSelectedSubject2(value || null)}
              className={styles.filterSelect}
              disabled={subjectsLoading}
              placeholder={subjectsLoading ? 'Loading subjects...' : 'Select subject'}
            />
            {subjectsError && (
              <div className={styles.error}>Failed to load subjects: {subjectsError}</div>
            )}
          </div>
        </div>

        <div className={styles.chartsGrid}>
          <Card className={styles.chartCard}>
            <Card.Header>
              <h3 className={styles.chartTitle}>Subject Evolution</h3>
              <p className={styles.chartSubtitle}>Yearly submission counts per subject</p>
            </Card.Header>
            <Card.Content>
              {subjectLoadingLocal ? (
                <div className={styles.loadingState}><div className={styles.loadingSpinner}></div><p>Loading subject evolution...</p></div>
              ) : subjectErrorLocal ? (
                <div className={styles.error}>Error: {subjectErrorLocal}</div>
              ) : !subjectAnalysis.evolutionData || subjectAnalysis.evolutionData.length === 0 ? (
                <div className={styles.emptyState}><div className={styles.emptyIcon}>📈</div><p>No evolution data available.</p></div>
              ) : (() => {
                const records = subjectAnalysis.evolutionData;
                const years = Array.from(new Set(records.map(r => r.year))).sort();
                const subjectsSet = Array.from(new Set(records.map(r => r.subject)));
                const palette = ['#2563eb','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4'];
                const datasets = subjectsSet.map((subj, i) => {
                  const byYear = new Map(records.filter(r => r.subject === subj).map(r => [r.year, r.count]));
                  return {
                    label: subj,
                    data: years.map(y => byYear.get(y) || 0),
                    borderColor: palette[i % palette.length],
                    backgroundColor: palette[i % palette.length] + '33',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                  };
                });
                const data = { labels: years, datasets };
                const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } };
                return <div style={{ height: 360 }}><Line data={data} options={options} /></div>;
              })()}
            </Card.Content>
          </Card>

          <Card className={styles.chartCard}>
            <Card.Header>
              <h3 className={styles.chartTitle}>Subject Citation Ranking</h3>
              <p className={styles.chartSubtitle}>Total and average citations per subject</p>
            </Card.Header>
            <Card.Content>
              {subjectLoadingLocal ? (
                <div className={styles.loadingState}><div className={styles.loadingSpinner}></div><p>Loading subject citation ranking...</p></div>
              ) : subjectErrorLocal ? (
                <div className={styles.error}>Error: {subjectErrorLocal}</div>
              ) : !subjectAnalysis.citationRanking || subjectAnalysis.citationRanking.length === 0 ? (
                <div className={styles.emptyState}><div className={styles.emptyIcon}>🏆</div><p>No citation ranking data available.</p></div>
              ) : (() => {
                const recs = subjectAnalysis.citationRanking;
                const labels = recs.map(r => r.subject);
                const totals = recs.map(r => r.total_citation);
                const data = { labels, datasets: [{ label: 'Total Citations', data: totals, backgroundColor: '#2563eb' }] };
                const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { afterBody: (items) => {
                  const idx = items[0].dataIndex; const r = recs[idx]; return `Avg per paper: ${r.avg_citation} (n=${r.paper_count})`;
                } } } }, indexAxis: 'y', scales: { x: { beginAtZero: true } } };
                return <div style={{ height: 360 }}><Bar data={data} options={options} /></div>;
              })()}
            </Card.Content>
          </Card>

          <Card className={styles.chartCard}>
            <Card.Header>
              <h3 className={styles.chartTitle}>Version Analysis</h3>
              <p className={styles.chartSubtitle}>Version distribution and summary</p>
            </Card.Header>
            <Card.Content>
              {subjectLoadingLocal ? (
                <div className={styles.loadingState}><div className={styles.loadingSpinner}></div><p>Loading version analysis...</p></div>
              ) : subjectErrorLocal ? (
                <div className={styles.error}>Error: {subjectErrorLocal}</div>
              ) : !subjectAnalysis.versionDistribution || subjectAnalysis.versionDistribution.length === 0 ? (
                <div className={styles.emptyState}><div className={styles.emptyIcon}>📊</div><p>No version data available.</p></div>
              ) : (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Summary:</strong>
                    <div>Total Papers: {subjectAnalysis?.versionSummary?.totalPapers || 0}</div>
                    <div>Multi-version Papers: {subjectAnalysis?.versionSummary?.multiVersionPapers || 0}</div>
                    <div>% Multi-version: {subjectAnalysis?.versionSummary?.percentMultiVersion || 0}%</div>
                  </div>
                  {(() => {
                    const selected = subjectAnalysis?.metadata?.selectedSubjects || [];
                    const palette = ['#2563eb','#f59e0b','#10b981','#ef4444'];
                    if (selected.length > 1 && subjectAnalysis.versionDistributionBySubject && subjectAnalysis.versionDistributionBySubject.length > 0) {
                      const recs = subjectAnalysis.versionDistributionBySubject;
                      const versions = Array.from(new Set(recs.map(r => r.versions))).sort((a,b)=>a-b);
                      const subjectsSet = Array.from(new Set(recs.map(r => r.subject)));
                      const datasets = subjectsSet.map((subj, i) => {
                        const byVer = new Map(recs.filter(r => r.subject === subj).map(r => [r.versions, r.count]));
                        return {
                          label: subj,
                          data: versions.map(v => byVer.get(v) || 0),
                          backgroundColor: palette[i % palette.length]
                        };
                      });
                      const data = { labels: versions, datasets };
                      const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { x: { title: { display: true, text: 'Versions' } }, y: { beginAtZero: true } } };
                      return <div style={{ height: 360 }}><Bar data={data} options={options} /></div>;
                    } else {
                      const recs = subjectAnalysis.versionDistribution;
                      const labels = recs.map(r => r.versions);
                      const counts = recs.map(r => r.count);
                      const data = { labels, datasets: [{ label: 'Papers', data: counts, backgroundColor: '#10b981' }] };
                      const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: 'Versions' } }, y: { beginAtZero: true } } };
                      return <div style={{ height: 360 }}><Bar data={data} options={options} /></div>;
                    }
                  })()}
                </>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubjectAnalysisTab;
