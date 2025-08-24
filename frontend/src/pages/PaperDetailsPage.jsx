import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Layout from '../components/layout/Layout/Layout';
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
  const chartRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    console.log('Fetching paper with ID:', id);

    ApiService.getPaper(id)
      .then(data => {
        console.log('Paper data received:', data);
        setPaper(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching paper:', error);
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (paper && paper.citation && chartRef.current) {
      try {
        const citations = JSON.parse(paper.citation);
        const ctx = document.createElement('canvas');
        chartRef.current.innerHTML = '';
        chartRef.current.appendChild(ctx);
        
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: citations.map(c => c.year),
            datasets: [{
              label: 'Citations per year',
              data: citations.map(c => c.value),
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: { 
              legend: { display: false },
              title: {
                display: true,
                text: 'Citation History'
              }
            },
            scales: { 
              y: { 
                beginAtZero: true, 
                ticks: { precision: 0 } 
              } 
            }
          }
        });
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    }
  }, [paper]);

  if (isLoading) {
    return (
      <Layout>
        <div className={layoutStyles.pageContainer}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <h2 className="text-heading-3">Loading paper details...</h2>
            <p className="text-body text-neutral-600">Please wait while we fetch the paper information.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!paper) {
    return (
      <Layout>
        <div className={layoutStyles.pageContainer}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>📄</div>
            <h1 className="text-heading-2 mb-4">Paper Not Found</h1>
            <p className="text-body mb-6">The requested paper could not be found in our database.</p>
            <div className={styles.errorActions}>
              <Link to="/explore">
                <Button variant="primary">
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

  const authors = paper.all_authors ? JSON.parse(paper.all_authors) : [];
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className={layoutStyles.pageContainer}>
        {/* Breadcrumb Navigation */}
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <Link to="/explore" className={styles.breadcrumbLink}>Explore</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span className={styles.breadcrumbCurrent}>Paper Details</span>
        </div>

        <div className={styles.paperContainer}>
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
                  href={`https://doi.org/${paper.preprint_doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="large">
                    View Original Paper
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
