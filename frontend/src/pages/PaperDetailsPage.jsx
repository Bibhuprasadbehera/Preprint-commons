import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import Layout from '../components/layout/Layout/Layout';

// Register the annotation plugin
Chart.register(annotationPlugin);
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import PaperMetadata from '../components/Paper/PaperMetadata';
import ApiService from '../services/api';
import layoutStyles from '../components/layout/Layout/Layout.module.css';
import styles from './PaperDetailsPage.module.css';

const PaperDetailsPage = () => {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const chartRef = useRef(null);

  const fetchPaper = async (attemptNumber = 1) => {
    try {
      console.log(`Fetching paper with ID: ${id} (attempt ${attemptNumber})`);
      console.log('API Base URL:', process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api');
      setError(null);

      const data = await ApiService.getPaper(id);
      console.log('Paper data received:', data);
      console.log('Paper data type:', typeof data);
      console.log('Paper data keys:', data ? Object.keys(data) : 'No data');

      if (!data) {
        throw new Error('No paper data received');
      }

      setPaper(data);
      setIsLoading(false);
      setRetryCount(0);
    } catch (error) {
      console.error(`Error fetching paper (attempt ${attemptNumber}):`, error);
      console.error('Error details:', error.message, error.stack);

      // Auto-retry up to 2 times with exponential backoff
      if (attemptNumber < 3) {
        const delay = Math.pow(2, attemptNumber - 1) * 1000; // 1s, 2s, 4s
        console.log(`Retrying in ${delay}ms...`);

        setTimeout(() => {
          fetchPaper(attemptNumber + 1);
        }, delay);
      } else {
        setError('Failed to load paper information');
        setIsLoading(false);
        setRetryCount(attemptNumber - 1);
      }
    }
  };

  const handleManualRetry = () => {
    setIsLoading(true);
    setPaper(null);
    setError(null);
    fetchPaper(1);
  };

  useEffect(() => {
    setIsLoading(true);
    setPaper(null);
    setError(null);
    fetchPaper(1);
  }, [id]);

  useEffect(() => {
    if (paper && paper.citation && chartRef.current) {
      try {
        // Handle malformed JSON with single quotes by replacing them with double quotes
        const fixedCitation = paper.citation.replace(/'/g, '"');
        const citations = JSON.parse(fixedCitation);
        console.log('Citations parsed successfully:', citations);

        // Parse versions if available
        let versions = [];
        if (paper.versions) {
          try {
            const fixedVersions = paper.versions.replace(/'/g, '"');
            versions = JSON.parse(fixedVersions);
          } catch (e) {
            console.error('Error parsing versions:', e);
          }
        }

        const submissionYear = paper.preprint_submission_date ? new Date(paper.preprint_submission_date).getFullYear() : null;
        
        // Dynamically determine the year range
        const citationYears = citations.map(c => parseInt(c.year, 10));
        const minYear = submissionYear ? submissionYear - 1 : Math.min(...citationYears) - 1;
        const maxYear = Math.max(...citationYears) + 1;
        const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => (minYear + i).toString());

        // Create a map for quick citation lookups
        const citationMap = new Map(citations.map(c => [c.year.toString(), c.value]));
        const publicationYear = paper.publication_date ? new Date(paper.publication_date).getFullYear().toString() : null;

        // Create annotations for versions, submission date, and publication date
        const annotations = {};

        // Add submission date annotation
        if (submissionYear && years.includes(submissionYear.toString())) {
          annotations.submissionLine = {
            type: 'line',
            xMin: submissionYear.toString(),
            xMax: submissionYear.toString(),
            borderColor: 'rgba(40, 167, 69, 0.8)',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              content: 'Preprint Submitted',
              position: 'start',
              backgroundColor: 'rgba(40, 167, 69, 0.8)',
              color: 'white',
              font: {
                size: 10,
                weight: 'bold'
              },
              padding: 4,
              yAdjust: -10
            }
          };
        }

        // Add publication date annotation
        if (publicationYear && years.includes(publicationYear)) {
          annotations.publicationLine = {
            type: 'line',
            xMin: publicationYear,
            xMax: publicationYear,
            borderColor: 'rgba(255, 99, 132, 0.8)',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              content: 'Peer-Reviewed',
              position: 'end',
              backgroundColor: 'rgba(255, 99, 132, 0.8)',
              color: 'white',
              font: {
                size: 10,
                weight: 'bold'
              },
              padding: 4
            }
          };
        }

        // Add version annotations
        versions.forEach((version, index) => {
          const versionDate = new Date(version.created);
          const versionYear = versionDate.getFullYear().toString();
          
          if (years.includes(versionYear)) {
            annotations[`version${index}`] = {
              type: 'point',
              xValue: versionYear,
              yValue: citations.find(c => c.year === versionYear)?.value || 0,
              backgroundColor: 'rgba(153, 102, 255, 0.8)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 2,
              radius: 6,
              label: {
                display: true,
                content: version.version || `v${index + 1}`,
                position: 'top',
                backgroundColor: 'rgba(108, 92, 231, 0.8)',
                color: 'white',
                font: {
                  size: 9,
                  weight: 'bold'
                },
                padding: 3
              }
            };
          }
        });

        const ctx = document.createElement('canvas');
        chartRef.current.innerHTML = '';
        chartRef.current.appendChild(ctx);

        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: years,
            datasets: [{
              label: 'Citations per year',
              data: years.map(year => citationMap.get(year) || 0),
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                display: true,
                position: 'bottom',
                labels: {
                  generateLabels: (chart) => {
                    const labels = [
                      {
                        text: 'Citations',
                        fillStyle: 'rgba(54, 162, 235, 0.7)',
                        strokeStyle: 'rgba(54, 162, 235, 1)',
                        lineWidth: 1
                      }
                    ];
                    
                    if (submissionYear) {
                      labels.push({
                        text: 'Preprint Submitted',
                        fillStyle: 'rgba(40, 167, 69, 0.8)',
                        strokeStyle: 'rgba(40, 167, 69, 0.8)',
                        lineWidth: 2,
                        lineDash: [5, 5]
                      });
                    }
                    
                    if (publicationYear) {
                      labels.push({
                        text: 'Peer-Reviewed Publication',
                        fillStyle: 'rgba(255, 99, 132, 0.8)',
                        strokeStyle: 'rgba(255, 99, 132, 0.8)',
                        lineWidth: 2,
                        lineDash: [5, 5]
                      });
                    }
                    
                    if (versions.length > 0) {
                      labels.push({
                        text: 'Preprint Version',
                        fillStyle: 'rgba(108, 92, 231, 0.8)',
                        strokeStyle: 'rgba(108, 92, 231, 1)',
                        lineWidth: 2,
                        pointStyle: 'circle'
                      });
                    }
                    
                    return labels;
                  }
                }
              },
              title: {
                display: true,
                text: 'Citation History',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              },
              annotation: {
                annotations: annotations
              },
              tooltip: {
                callbacks: {
                  afterBody: (tooltipItems) => {
                    const year = tooltipItems[0].label;
                    const info = [];
                    
                    // Add version info
                    const yearVersions = versions.filter(v => 
                      new Date(v.created).getFullYear().toString() === year
                    );
                    if (yearVersions.length > 0) {
                      info.push('');
                      yearVersions.forEach(v => {
                        const date = new Date(v.created).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        });
                        info.push(`${v.version || 'Version'}: ${date}`);
                      });
                    }
                    
                    // Add submission info
                    if (year === submissionYear) {
                      info.push('');
                      info.push(`Submitted: ${new Date(paper.preprint_submission_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}`);
                    }
                    
                    // Add publication info
                    if (year === publicationYear) {
                      info.push('');
                      info.push(`Published: ${new Date(paper.publication_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}`);
                    }
                    
                    return info;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { precision: 0 },
                title: {
                  display: true,
                  text: 'Number of Citations'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Year'
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error creating chart:', error);
        console.error('Raw citation data:', paper.citation);
      }
    }
  }, [paper]);

  if (isLoading) {
    return (
      <Layout>
        <div className={`${layoutStyles.pageContainer} animate-fadeInUp`}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <h2 className="text-heading-3">Loading paper details...</h2>
            <p className="text-body text-neutral-600">Please wait while we fetch the paper information.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || (!paper && !isLoading)) {
    return (
      <Layout>
        <div className={layoutStyles.pageContainer}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>📄</div>
            <h1 className="text-heading-2 mb-4">
              {error ? 'Failed to Load Paper' : 'Paper Not Found'}
            </h1>
            <p className="text-body mb-4">
              {error 
                ? `We encountered an issue loading this paper. ${retryCount > 0 ? `We tried ${retryCount + 1} times.` : ''}`
                : 'The requested paper could not be found in our database.'
              }
            </p>
            {error && (
              <p className="text-body-small mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                Paper ID: {id}
              </p>
            )}
            <div className={styles.errorActions}>
              {error && (
                <Button 
                  variant="primary" 
                  onClick={handleManualRetry}
                  disabled={isLoading}
                >
                  {isLoading ? 'Retrying...' : 'Try Again'}
                </Button>
              )}
              <Link to="/explore">
                <Button variant={error ? "outline" : "primary"}>
                  Search Papers
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline">
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  let authors = [];
  try {
    if (paper.all_authors) {
      // Handle malformed JSON with single quotes by replacing them with double quotes
      const fixedAuthors = paper.all_authors.replace(/'/g, '"');
      authors = JSON.parse(fixedAuthors);
      console.log('Authors parsed successfully:', authors);
    }
  } catch (error) {
    console.error('Error parsing authors JSON:', error);
    console.error('Raw authors data:', paper.all_authors);
    authors = [];
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPreprintUrl = (doi, server) => {
    if (!doi) return null;
    
    const serverLower = server?.toLowerCase() || '';
    
    // arXiv uses a different URL format
    if (serverLower === 'arxiv') {
      return `https://arxiv.org/abs/${doi}`;
    }
    
    // bioRxiv and medRxiv use DOI URLs
    return `https://doi.org/${doi}`;
  };

  return (
    <Layout>
      <div className={layoutStyles.pageContainer}>
        {/* Breadcrumb Navigation */}
        <div className={`${styles.breadcrumb} animate-fadeInUp`}>
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <Link to="/explore" className={styles.breadcrumbLink}>Explore</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span className={styles.breadcrumbCurrent}>Paper Details</span>
        </div>

        <div className={`${styles.paperContainer} animate-fadeInUp animate-delay-1`}>
          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Paper Header */}
            <div className={styles.paperHeader}>
              <div className={styles.paperBadge}>
                <span className={styles.badgeText}>Preprint</span>
                {paper.preprint_server && (
                  <span className={styles.serverBadge}>{paper.preprint_server}</span>
                )}
              </div>
              
              <h1 className={styles.paperTitle}>{paper.preprint_title}</h1>
              
              <div className={styles.paperMeta}>
                <div className={styles.authorsList}>
                  {authors.map(a => a.author_name).join(', ')}
                </div>
                <div className={styles.paperDate}>
                  Submitted: {formatDate(paper.preprint_submission_date)}
                </div>
                {paper.total_citation && (
                  <div className={styles.citationCount}>
                    {paper.total_citation} citations
                  </div>
                )}
              </div>
            </div>
            
            {/* Abstract Section */}
            {paper.preprint_abstract && (
              <Card className={styles.abstractCard}>
                <Card.Header>
                  <h2 className={styles.sectionTitle}>Abstract</h2>
                </Card.Header>
                <Card.Content>
                  <p className={styles.abstractText}>{paper.preprint_abstract}</p>
                </Card.Content>
              </Card>
            )}
            
            {/* Citation Chart */}
            {paper.citation && (
              <Card className={styles.chartCard}>
                <Card.Header>
                  <h2 className={styles.sectionTitle}>Citation History</h2>
                  <p className={styles.chartDescription}>
                    Track citation trends over time with key milestones including submission date, publication date, and version releases.
                  </p>
                </Card.Header>
                <Card.Content>
                  <div ref={chartRef} className={styles.chartContainer}></div>
                </Card.Content>
              </Card>
            )}
            
            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              {paper.preprint_doi && (
                <a 
                  href={getPreprintUrl(paper.preprint_doi, paper.preprint_server)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="large">
                    View Original Preprint
                  </Button>
                </a>
              )}
              {paper.published_DOI && (
                <a 
                  href={`https://doi.org/${paper.published_DOI}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="large">
                    View Published Version
                  </Button>
                </a>
              )}
            </div>
          </div>
          
          {/* Metadata Sidebar */}
          <div className={styles.sidebar}>
            <PaperMetadata paper={paper} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaperDetailsPage;
