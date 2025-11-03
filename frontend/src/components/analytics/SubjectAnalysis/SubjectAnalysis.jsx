import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import Card from '../../ui/Card/Card';
import Select from '../../ui/Select/Select';
import Button from '../../ui/Button/Button';
import Header from '../../ui/Header/Header';
import DynamicSectionTitle from '../../ui/DynamicSectionTitle/DynamicSectionTitle';
import ApiService from '../../../services/api';
import { API_BASE_URL } from '../../../utils/api';
import styles from './SubjectAnalysis.module.css';

const SubjectAnalysis = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubject2, setSelectedSubject2] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([{ value: '', label: 'All Subjects' }]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [subjectAnalysis, setSubjectAnalysis] = useState({
    evolutionData: [],
    citationRanking: [],
    versionDistribution: [],
    versionDistributionBySubject: [],
    monthlyTrends: [],
    serverDistribution: [],
    citationGrowth: [],
    versionSummary: null,
    metadata: {}
  });
  const [subjectLoadingLocal, setSubjectLoadingLocal] = useState(false);
  const [subjectErrorLocal, setSubjectErrorLocal] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    if (subjectOptions.length > 1) return;
    
    setSubjectsLoading(true);
    try {
      const res = await ApiService.getSubjects();
      const opts = [
        { value: '', label: 'All Subjects' },
        ...((res?.data || []).map((s) => ({ 
          value: s, 
          label: s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') 
        })))
      ];
      setSubjectOptions(opts);
    } catch (e) {
      setSubjectsError(String(e));
    } finally {
      setSubjectsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setIsSearching(true);
    setSubjectErrorLocal(null);
    setSubjectLoadingLocal(true);
    
    try {
      const params = new URLSearchParams();
      if (selectedTimeRange) params.append('time_range', selectedTimeRange);
      
      const subjectsList = [selectedSubject, selectedSubject2].filter(Boolean);
      if (subjectsList.length > 0) {
        params.append('subjects', subjectsList.join(','));
      } else if (selectedSubject) {
        params.append('subject', selectedSubject);
      }
      
      params.append('top', '10');
      const res = await fetch(`${API_BASE_URL}/api/subjects/analysis?${params.toString()}`);
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const json = await res.json();
      setSubjectAnalysis(json);
    } catch (e) {
      setSubjectErrorLocal(String(e));
      setSubjectAnalysis({
        evolutionData: [],
        citationRanking: [],
        versionDistribution: [],
        versionDistributionBySubject: [],
        monthlyTrends: [],
        serverDistribution: [],
        citationGrowth: [],
        versionSummary: null,
        metadata: {}
      });
    } finally {
      setSubjectLoadingLocal(false);
      setIsSearching(false);
    }
  };

  const createLineChartData = (dataArray, valueKey = 'count') => {
    const subjectMap = {};
    const allKeys = new Set();
    
    dataArray.forEach(d => {
      const key = d.year || d.month;
      allKeys.add(key);
      if (!subjectMap[d.subject]) {
        subjectMap[d.subject] = {};
      }
      subjectMap[d.subject][key] = d[valueKey];
    });
    
    const sortedKeys = Array.from(allKeys).sort();
    const colors = [
      { border: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.1)' },
      { border: 'rgb(16, 185, 129)', bg: 'rgba(16, 185, 129, 0.1)' },
      { border: 'rgb(245, 158, 11)', bg: 'rgba(245, 158, 11, 0.1)' },
      { border: 'rgb(239, 68, 68)', bg: 'rgba(239, 68, 68, 0.1)' },
      { border: 'rgb(139, 92, 246)', bg: 'rgba(139, 92, 246, 0.1)' }
    ];
    
    const datasets = Object.keys(subjectMap).map((subject, idx) => ({
      label: subject,
      data: sortedKeys.map(key => subjectMap[subject][key] || 0),
      borderColor: colors[idx % colors.length].border,
      backgroundColor: colors[idx % colors.length].bg,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: valueKey === 'avg_citation'
    }));
    
    return { labels: sortedKeys, datasets };
  };

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          padding: 15,
          font: { size: 13, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12
      }
    }
  };

  return (
    <div className="container-wide">
      <div className={styles.subjectAnalysis}>
        <Header 
          title="Subject Analysis"
          subtitle="Analyze research trends and patterns across different subject areas."
          variant="section"
          size="medium"
        />

        <div className={styles.controls}>
          <div className={styles.filters}>
            <Select
              value={selectedTimeRange}
              onChange={setSelectedTimeRange}
              options={[
                { value: 'all', label: 'All Time' },
                { value: '1y', label: 'Last Year' },
                { value: '2y', label: 'Last 2 Years' },
                { value: '5y', label: 'Last 5 Years' }
              ]}
              placeholder="Select time range"
              className={styles.filterSelect}
            />
            
            <Select
              value={selectedSubject || ''}
              onChange={setSelectedSubject}
              options={subjectOptions}
              placeholder="Select primary subject"
              loading={subjectsLoading}
              className={styles.filterSelect}
            />
            
            <Select
              value={selectedSubject2 || ''}
              onChange={setSelectedSubject2}
              options={subjectOptions}
              placeholder="Compare with subject (optional)"
              loading={subjectsLoading}
              className={styles.filterSelect}
            />
          </div>

          <Button
            variant="primary"
            onClick={handleAnalyze}
            disabled={isSearching}
            className={styles.analyzeButton}
          >
            {isSearching ? 'Analyzing...' : 'Analyze Subjects'}
          </Button>
        </div>

        {subjectErrorLocal && (
          <div className={styles.error}>
            Error: {subjectErrorLocal}
          </div>
        )}

        {subjectLoadingLocal && (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p className="text-body">Analyzing subject data...</p>
          </div>
        )}

        {!subjectLoadingLocal && subjectAnalysis.evolutionData.length > 0 && (
          <div className={styles.results}>
            <DynamicSectionTitle 
              title="Subject Analysis Results"
              subtitle="Research trend and patterns in the selected subject areas"
            />
            
            <div className={styles.chartsGrid}>
              {/* Subject Evolution Chart */}
              <Card className={styles.chartCard}>
                <Card.Header>
                  <h3 className={styles.chartTitle}>Subject Evolution Over Time</h3>
                  <p className={styles.chartSubtitle}>
                    {subjectAnalysis.metadata?.selectedSubjects?.length > 0 
                      ? `Comparing: ${subjectAnalysis.metadata.selectedSubjects.join(', ')}`
                      : 'Publication trends over time'}
                  </p>
                </Card.Header>
                <Card.Content>
                  <div className={styles.chartWrapper}>
                    <Line 
                      data={createLineChartData(subjectAnalysis.evolutionData)}
                      options={{
                        ...commonChartOptions,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Publications', font: { size: 13, weight: '600' } },
                            ticks: { font: { size: 12 } },
                            grid: { color: 'rgba(0, 0, 0, 0.05)' }
                          },
                          x: {
                            ticks: { font: { size: 12 } },
                            grid: { display: false }
                          }
                        }
                      }}
                    />
                  </div>
                </Card.Content>
              </Card>

              {/* Citation Statistics */}
              {subjectAnalysis.citationRanking?.length > 0 && (
                <Card className={styles.chartCard}>
                  <Card.Header>
                    <h3 className={styles.chartTitle}>Citation Statistics by Subject</h3>
                    <p className={styles.chartSubtitle}>Total and average citations per subject</p>
                  </Card.Header>
                  <Card.Content>
                    <div className={styles.chartWrapper}>
                      <Bar 
                        data={{
                          labels: subjectAnalysis.citationRanking.map(d => d.subject),
                          datasets: [
                            {
                              label: 'Total Citations',
                              data: subjectAnalysis.citationRanking.map(d => d.total_citation),
                              backgroundColor: 'rgba(59, 130, 246, 0.6)',
                              borderColor: 'rgb(59, 130, 246)',
                              borderWidth: 2,
                              yAxisID: 'y'
                            },
                            {
                              label: 'Average Citations',
                              data: subjectAnalysis.citationRanking.map(d => d.avg_citation),
                              backgroundColor: 'rgba(16, 185, 129, 0.6)',
                              borderColor: 'rgb(16, 185, 129)',
                              borderWidth: 2,
                              yAxisID: 'y1'
                            }
                          ]
                        }}
                        options={{
                          ...commonChartOptions,
                          plugins: {
                            ...commonChartOptions.plugins,
                            tooltip: {
                              ...commonChartOptions.plugins.tooltip,
                              callbacks: {
                                afterLabel: (context) => {
                                  const item = subjectAnalysis.citationRanking[context.dataIndex];
                                  return `Papers: ${item.paper_count}`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              type: 'linear',
                              position: 'left',
                              beginAtZero: true,
                              title: { display: true, text: 'Total Citations', font: { size: 13, weight: '600' } },
                              ticks: { font: { size: 12 } },
                              grid: { color: 'rgba(0, 0, 0, 0.05)' }
                            },
                            y1: {
                              type: 'linear',
                              position: 'right',
                              beginAtZero: true,
                              title: { display: true, text: 'Average Citations', font: { size: 13, weight: '600' } },
                              ticks: { font: { size: 12 } },
                              grid: { drawOnChartArea: false }
                            },
                            x: {
                              ticks: { font: { size: 12 }, maxRotation: 45, minRotation: 45 },
                              grid: { display: false }
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Content>
                </Card>
              )}

              {/* Version Distribution */}
              {subjectAnalysis.versionDistribution?.length > 0 && (
                <Card className={styles.chartCard}>
                  <Card.Header>
                    <h3 className={styles.chartTitle}>Version Distribution</h3>
                    <p className={styles.chartSubtitle}>
                      Number of papers by version count
                      {subjectAnalysis.versionSummary && (
                        <span style={{ marginLeft: '1rem', color: '#64748b' }}>
                          ({subjectAnalysis.versionSummary.percentMultiVersion}% have multiple versions)
                        </span>
                      )}
                    </p>
                  </Card.Header>
                  <Card.Content>
                    <div className={styles.chartWrapper}>
                      <Bar 
                        data={{
                          labels: subjectAnalysis.versionDistribution.map(d => `${d.versions} version${d.versions > 1 ? 's' : ''}`),
                          datasets: [{
                            label: 'Number of Papers',
                            data: subjectAnalysis.versionDistribution.map(d => d.count),
                            backgroundColor: 'rgba(139, 92, 246, 0.6)',
                            borderColor: 'rgb(139, 92, 246)',
                            borderWidth: 2
                          }]
                        }}
                        options={{
                          ...commonChartOptions,
                          plugins: { ...commonChartOptions.plugins, legend: { display: false } },
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: { display: true, text: 'Number of Papers', font: { size: 13, weight: '600' } },
                              ticks: { font: { size: 12 } },
                              grid: { color: 'rgba(0, 0, 0, 0.05)' }
                            },
                            x: {
                              title: { display: true, text: 'Version Count', font: { size: 13, weight: '600' } },
                              ticks: { font: { size: 12 } },
                              grid: { display: false }
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Content>
                </Card>
              )}

              {/* Version Distribution by Subject */}
              {subjectAnalysis.versionDistributionBySubject?.length > 0 && (
                <Card className={styles.chartCard}>
                  <Card.Header>
                    <h3 className={styles.chartTitle}>Version Distribution by Subject</h3>
                    <p className={styles.chartSubtitle}>Comparing version patterns across subjects</p>
                  </Card.Header>
                  <Card.Content>
                    <div className={styles.chartWrapper}>
                      <Bar 
                        data={(() => {
                          const subjectVersionMap = {};
                          const allVersions = new Set();
                          
                          subjectAnalysis.versionDistributionBySubject.forEach(d => {
                            allVersions.add(d.versions);
                            if (!subjectVersionMap[d.subject]) {
                              subjectVersionMap[d.subject] = {};
                            }
                            subjectVersionMap[d.subject][d.versions] = d.count;
                          });
                          
                          const sortedVersions = Array.from(allVersions).sort((a, b) => a - b);
                          const colors = [
                            { bg: 'rgba(59, 130, 246, 0.6)', border: 'rgb(59, 130, 246)' },
                            { bg: 'rgba(16, 185, 129, 0.6)', border: 'rgb(16, 185, 129)' },
                            { bg: 'rgba(245, 158, 11, 0.6)', border: 'rgb(245, 158, 11)' },
                            { bg: 'rgba(239, 68, 68, 0.6)', border: 'rgb(239, 68, 68)' },
                            { bg: 'rgba(139, 92, 246, 0.6)', border: 'rgb(139, 92, 246)' }
                          ];
                          
                          const datasets = Object.keys(subjectVersionMap).map((subject, idx) => ({
                            label: subject,
                            data: sortedVersions.map(v => subjectVersionMap[subject][v] || 0),
                            backgroundColor: colors[idx % colors.length].bg,
                            borderColor: colors[idx % colors.length].border,
                            borderWidth: 2
                          }));
                          
                          return {
                            labels: sortedVersions.map(v => `${v} version${v > 1 ? 's' : ''}`),
                            datasets
                          };
                        })()}
                        options={{
                          ...commonChartOptions,
                          scales: {
                            y: {
                              beginAtZero: true,
                              stacked: false,
                              title: { display: true, text: 'Number of Papers', font: { size: 13, weight: '600' } },
                              ticks: { font: { size: 12 } },
                              grid: { color: 'rgba(0, 0, 0, 0.05)' }
                            },
                            x: {
                              stacked: false,
                              title: { display: true, text: 'Version Count', font: { size: 13, weight: '600' } },
                              ticks: { font: { size: 12 } },
                              grid: { display: false }
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Content>
                </Card>
              )}

              {/* Monthly Trends */}
              {subjectAnalysis.monthlyTrends?.length > 0 && (
                <Card className={styles.chartCard}>
                  <Card.Header>
                    <h3 className={styles.chartTitle}>Monthly Publication Trends</h3>
                    <p className={styles.chartSubtitle}>Detailed month-by-month publication patterns</p>
                  </Card.Header>
                  <Card.Content>
                    <div className={styles.chartWrapper}>
                      <Line 
                        data={{
                          ...createLineChartData(subjectAnalysis.monthlyTrends),
                          datasets: createLineChartData(subjectAnalysis.monthlyTrends).datasets.map(ds => ({
                            ...ds,
                            borderWidth: 2,
                            pointRadius: 2,
                            pointHoverRadius: 5,
                            tension: 0.3
                          }))
                        }}
                        options={{
                          ...commonChartOptions,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: { display: true, text: 'Publications', font: { size: 13, weight: '600' } },
                              ticks: { font: { size: 12 } },
                              grid: { color: 'rgba(0, 0, 0, 0.05)' }
                            },
                            x: {
                              ticks: { font: { size: 11 }, maxRotation: 45, minRotation: 45 },
                              grid: { display: false }
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Content>
                </Card>
              )}

              {/* Server Distribution */}
              {subjectAnalysis.serverDistribution?.length > 0 && (
                <Card className={styles.chartCard}>
                  <Card.Header>
                    <h3 className={styles.chartTitle}>Server Distribution by Subject</h3>
                    <p className={styles.chartSubtitle}>Which preprint servers host papers in each subject</p>
                  </Card.Header>
                  <Card.Content>
                    <div className={styles.chartWrapper}>
                      <Bar 
                        data={(() => {
                          const subjectServerMap = {};
                          const allServers = new Set();
                          
                          subjectAnalysis.serverDistribution.forEach(d => {
                            allServers.add(d.server);
                            if (!subjectServerMap[d.subject]) {
                              subjectServerMap[d.subject] = {};
                            }
                            subjectServerMap[d.subject][d.server] = d.count;
                          });
                          
                          const sortedServers = Array.from(allServers).sort();
                          const colors = [
                            { bg: 'rgba(59, 130, 246, 0.6)', border: 'rgb(59, 130, 246)' },
                            { bg: 'rgba(16, 185, 129, 0.6)', border: 'rgb(16, 185, 129)' },
                            { bg: 'rgba(245, 158, 11, 0.6)', border: 'rgb(245, 158, 11)' },
                            { bg: 'rgba(239, 68, 68, 0.6)', border: 'rgb(239, 68, 68)' },
                            { bg: 'rgba(139, 92, 246, 0.6)', border: 'rgb(139, 92, 246)' }
                          ];
                          
                          const datasets = Object.keys(subjectServerMap).map((subject, idx) => ({
                            label: subject,
                            data: sortedServers.map(server => subjectServerMap[subject][server] || 0),
                            backgroundColor: colors[idx % colors.length].bg,
                            borderColor: colors[idx % colors.length].border,
                            borderWidth: 2
                          }));
                          
                          return { labels: sortedServers, datasets };
                        })()}
                        options={{
                          ...commonChartOptions,
                          scales: {
                            y: {
                              beginAtZero: true,
                              stacked: true,
                              title: { display: true, text: 'Number of Papers', font: { size: 13, weight: '600' } },
                              ticks: { font: { size: 12 } },
                              grid: { color: 'rgba(0, 0, 0, 0.05)' }
                            },
                            x: {
                              stacked: true,
                              ticks: { font: { size: 12 } },
                              grid: { display: false }
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Content>
                </Card>
              )}

              {/* Citation Growth */}
              {subjectAnalysis.citationGrowth?.length > 0 && (
                <Card className={styles.chartCard}>
                  <Card.Header>
                    <h3 className={styles.chartTitle}>Average Citation Growth by Year</h3>
                    <p className={styles.chartSubtitle}>How citation rates have evolved over time for each subject</p>
                  </Card.Header>
                  <Card.Content>
                    <div className={styles.chartWrapper}>
                      <Line 
                        data={createLineChartData(subjectAnalysis.citationGrowth, 'avg_citation')}
                        options={{
                          ...commonChartOptions,
                          plugins: {
                            ...commonChartOptions.plugins,
                            tooltip: {
                              ...commonChartOptions.plugins.tooltip,
                              callbacks: {
                                afterLabel: (context) => {
                                  const year = context.label;
                                  const subject = context.dataset.label;
                                  const item = subjectAnalysis.citationGrowth.find(
                                    d => d.year === year && d.subject === subject
                                  );
                                  if (item) {
                                    return [
                                      `Papers: ${item.paper_count}`,
                                      `Max Citations: ${item.max_citation}`
                                    ];
                                  }
                                  return '';
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: { display: true, text: 'Average Citations', font: { size: 13, weight: '600' } },
                              ticks: { font: { size: 12 } },
                              grid: { color: 'rgba(0, 0, 0, 0.05)' }
                            },
                            x: {
                              title: { display: true, text: 'Year', font: { size: 13, weight: '600' } },
                              ticks: { font: { size: 12 } },
                              grid: { display: false }
                            }
                          }
                        }}
                      />
                    </div>
                  </Card.Content>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectAnalysis;