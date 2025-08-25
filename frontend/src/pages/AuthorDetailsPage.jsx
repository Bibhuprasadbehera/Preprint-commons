import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Layout from '../components/layout/Layout/Layout';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import PapersList from '../components/ui/PapersList/PapersList';
import ApiService from '../services/api';
import layoutStyles from '../components/layout/Layout/Layout.module.css';
import styles from './AuthorDetailsPage.module.css';

const AuthorDetailsPage = () => {
  const { authorName } = useParams();
  const [authorData, setAuthorData] = useState(null);
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Decode the author name to handle both encoded (%20) and non-encoded spaces
    const decodedAuthorName = decodeURIComponent(authorName);
    
    // Try the API call with the decoded name first
    const tryApiCall = (nameToTry) => {
      return ApiService.getAuthorPapers(nameToTry)
        .then(data => {
          console.log('Author papers data received:', data);

          if (!data || !data.papers || data.papers.length === 0) {
            throw new Error('No papers found for this author');
          }

          const papersList = data.papers;
          setPapers(papersList);

          // Calculate author statistics
          const totalPapers = papersList.length;
          const totalCitations = papersList.reduce((sum, paper) => sum + (paper.total_citation || 0), 0);

          // Get author metadata from the first paper
          const firstPaper = papersList[0];
          const institution = firstPaper.corresponding_institution || 'Not available';
          const country = firstPaper.country_name || 'Not available';

          setAuthorData({
            name: decodedAuthorName,
            totalPapers,
            totalCitations,
            institution,
            country,
            papersOverTime: calculatePapersOverTime(papersList)
          });

          setIsLoading(false);
          return data;
        });
    };

    // Try with decoded name first, then with original if that fails
    tryApiCall(decodedAuthorName)
      .catch(error => {
        console.log('First attempt failed, trying with original parameter:', error.message);
        // If decoded name fails, try with the original parameter
        return tryApiCall(authorName);
      })
      .catch(error => {
        console.error('Both API attempts failed:', error);
        setError('Failed to load author information');
        setIsLoading(false);
      });
  }, [authorName]);

  const calculatePapersOverTime = (papersList) => {
    const yearData = {};

    papersList.forEach(paper => {
      const year = new Date(paper.preprint_submission_date).getFullYear();
      if (!yearData[year]) {
        yearData[year] = { papers: 0, citations: 0 };
      }
      yearData[year].papers += 1;
      yearData[year].citations += paper.total_citation || 0;
    });

    return Object.entries(yearData)
      .map(([year, data]) => ({
        year: parseInt(year),
        papers: data.papers,
        citations: data.citations
      }))
      .sort((a, b) => a.year - b.year);
  };

  useEffect(() => {
    if (authorData && authorData.papersOverTime && chartRef.current) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      const data = authorData.papersOverTime;

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(d => d.year),
          datasets: [
            {
              label: 'Papers Published',
              data: data.map(d => d.papers),
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.1)',
              yAxisID: 'y',
              tension: 0.4
            },
            {
              label: 'Total Citations',
              data: data.map(d => d.citations),
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.1)',
              yAxisID: 'y1',
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          stacked: false,
          plugins: {
            title: {
              display: true,
              text: 'Author Publications & Citations Over Time'
            },
            legend: {
              position: 'top',
            },
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Number of Papers'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Total Citations'
              },
              grid: {
                drawOnChartArea: false,
              },
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [authorData]);

  if (isLoading) {
    return (
      <Layout>
        <div className={layoutStyles.pageContainer}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <h2 className="text-heading-3">Loading author information...</h2>
            <p className="text-body text-neutral-600">Please wait while we fetch the author details.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={layoutStyles.pageContainer}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>👤</div>
            <h1 className="text-heading-2 mb-4">Author Not Found</h1>
            <p className="text-body mb-6">{error}</p>
            <div className={styles.errorActions}>
              <Link to="/explore">
                <Button variant="primary">
                  Search Authors
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

  return (
    <Layout>
      <div className={layoutStyles.pageContainer}>
        {/* Breadcrumb Navigation */}
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <Link to="/explore" className={styles.breadcrumbLink}>Explore</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span className={styles.breadcrumbCurrent}>Author Details</span>
        </div>

        <div className={styles.authorContainer}>
          {/* Author Header */}
          <div className={styles.authorHeader}>
            <div className={styles.authorBadge}>
              <span className={styles.badgeIcon}>👤</span>
            </div>

            <div className={styles.authorInfo}>
              <h1 className={styles.authorName}>{authorData?.name}</h1>

              <div className={`${styles.authorStats} ${
                authorData?.country && authorData.country !== 'Not available' && authorData.country.trim() !== '' 
                  ? styles.statsGridWithCountry 
                  : styles.statsGridWithoutCountry
              }`}>
                <div className={`${styles.statItem} ${styles.papersItem}`}>
                  <span className={styles.statNumber}>{authorData?.totalPapers}</span>
                  <span className={styles.statLabel}>Papers</span>
                </div>
                
                <div className={`${styles.statItem} ${styles.citationsItem}`}>
                  <span className={styles.statNumber}>{authorData?.totalCitations?.toLocaleString()}</span>
                  <span className={styles.statLabel}>Citations</span>
                </div>
                
                <div className={`${styles.statItem} ${styles.institutionItem}`}>
                  <span className={styles.statNumber}>
                    {authorData?.institution && authorData.institution !== 'Not available' 
                      ? authorData.institution 
                      : 'Not specified'}
                  </span>
                  <span className={styles.statLabel}>Institution</span>
                </div>
                
                {authorData?.country && authorData.country !== 'Not available' && authorData.country.trim() !== '' && (
                  <div className={`${styles.statItem} ${styles.countryItem}`}>
                    <span className={styles.statNumber}>{authorData.country}</span>
                    <span className={styles.statLabel}>Country</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Publications Timeline Chart */}
          {authorData?.papersOverTime && authorData.papersOverTime.length > 0 && (
            <Card className={styles.chartCard}>
              <Card.Header>
                <h2 className={styles.sectionTitle}>Publication Timeline</h2>
                <p className={styles.chartSubtitle}>Papers and citations over time</p>
              </Card.Header>
              <Card.Content>
                <div className={styles.chartContainer}>
                  <canvas ref={chartRef}></canvas>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Papers by Author */}
          <Card className={styles.papersCard}>
            <Card.Header>
              <h2 className={styles.sectionTitle}>Papers by {authorData?.name}</h2>
              <p className={styles.papersSubtitle}>
                {authorData?.totalPapers} papers with {authorData?.totalCitations.toLocaleString()} total citations
              </p>
            </Card.Header>
            <Card.Content>
              <PapersList
                papers={papers}
                loading={false}
                onPaperClick={(paper) => console.log('Paper clicked:', paper)}
              />
            </Card.Content>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AuthorDetailsPage;