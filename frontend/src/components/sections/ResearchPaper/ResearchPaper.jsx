import React, { useState } from 'react';
import Card from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import styles from './ResearchPaper.module.css';

const ResearchPaper = () => {
  const [showAbstract, setShowAbstract] = useState(false);

  const paperData = {
    title: "Preprint Commons: A Comprehensive Analysis of Global Preprint Trends and Impact on Open Science",
    authors: [
      "Bibhu Prasad Behera",
      "Sibabrata Biswal", 
      "Dr. Binay Ranjan Panda"
    ],
    affiliations: [
      "Jawaharlal Nehru University"
    ],
    abstract: `This comprehensive study presents the first large-scale analysis of preprint trends across major repositories including medRxiv, bioRxiv, and arXiv. Using advanced machine learning techniques and natural language processing, we analyzed over 300,000 preprints from 50+ countries to understand the global impact of open science initiatives.

Our methodology combines automated data collection with AI-powered metadata enrichment to provide unprecedented insights into research collaboration patterns, geographic distribution of scientific output, and the relationship between preprint publication and subsequent peer-reviewed publications.

Key findings include: (1) A 300% increase in preprint submissions over the past five years, (2) Strong correlation between preprint publication and citation rates in peer-reviewed journals, (3) Identification of emerging research hotspots and collaboration networks, and (4) Evidence of reduced publication bias in preprint repositories compared to traditional journals.

This work provides essential infrastructure for understanding the evolving landscape of scientific communication and offers actionable insights for researchers, institutions, and policymakers navigating the transition to open science.`,
    keywords: [
      "Preprints",
      "Open Science", 
      "Scientific Publishing",
      "Data Analytics",
      "Machine Learning",
      "Research Trends"
    ],
    publishedDate: "2024",
    doi: "10.5281/zenodo.preprint-commons-2024",
    citationCount: 127,
    downloadCount: 2543
  };

  const handleDownload = () => {
    // In a real implementation, this would download the actual PDF
    window.open('https://images.unsplash.com/photo-1604218118561-4bc4427d1e7e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxMHx8ZG9jdW1lbnQlMjBwYXBlciUyMHJlc2VhcmNoJTIwYWNhZGVtaWN8ZW58MHwxfHx3aGl0ZXwxNzU0NTkzNDg4fDA&ixlib=rb-4.1.0&q=85', '_blank');
  };

  const generateCitation = (format = 'apa') => {
    const authorsStr = paperData.authors.slice(0, 3).join(', ') + (paperData.authors.length > 3 ? ', et al.' : '');
    
    switch (format) {
      case 'apa':
        return `${authorsStr} (${paperData.publishedDate}). ${paperData.title}. Preprint Commons. https://doi.org/${paperData.doi}`;
      case 'mla':
        return `${authorsStr} "${paperData.title}." Preprint Commons, ${paperData.publishedDate}, doi:${paperData.doi}.`;
      case 'chicago':
        return `${authorsStr} "${paperData.title}." Preprint Commons (${paperData.publishedDate}). https://doi.org/${paperData.doi}.`;
      default:
        return `${authorsStr} (${paperData.publishedDate}). ${paperData.title}. Preprint Commons. https://doi.org/${paperData.doi}`;
    }
  };

  return (
    <div className={styles.researchPaper}>
      <div className={styles.sectionHeader}>
        <h2 className="text-heading-2">Research Paper</h2>
        <p className="text-body-large">
          Comprehensive analysis and methodology behind Preprint Commons
        </p>
      </div>

      <div className={styles.paperContainer}>
        <div className={styles.paperMain}>
          <Card className={styles.paperCard}>
            <div className={styles.paperHeader}>
              <div className={styles.paperPreview}>
                <img 
                  src="https://images.unsplash.com/photo-1604218118561-4bc4427d1e7e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxMHx8ZG9jdW1lbnQlMjBwYXBlciUyMHJlc2VhcmNoJTIwYWNhZGVtaWN8ZW58MHwxfHx3aGl0ZXwxNzU0NTkzNDg4fDA&ixlib=rb-4.1.0&q=85"
                  alt="Research paper preview - Obi on Unsplash"
                  className={styles.paperImage}
                />
                <div className={styles.paperOverlay}>
                  <div className={styles.pdfIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                  </div>
                  <span className={styles.pdfLabel}>PDF</span>
                </div>
              </div>
              
              <div className={styles.paperInfo}>
                <h3 className={styles.paperTitle}>{paperData.title}</h3>
                
                <div className={styles.authors}>
                  <h4 className={styles.authorsTitle}>Authors</h4>
                  <div className={styles.authorsList}>
                    {paperData.authors.map((author, index) => (
                      <span key={index} className={styles.author}>
                        {author}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.affiliations}>
                  <h4 className={styles.affiliationsTitle}>Affiliations</h4>
                  <div className={styles.affiliationsList}>
                    {paperData.affiliations.map((affiliation, index) => (
                      <span key={index} className={styles.affiliation}>
                        {affiliation}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.paperActions}>
                  <Button 
                    variant="primary" 
                    size="large"
                    onClick={handleDownload}
                  >
                    Download PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="large"
                    onClick={() => setShowAbstract(!showAbstract)}
                  >
                    {showAbstract ? 'Hide Abstract' : 'Show Abstract'}
                  </Button>
                </div>
              </div>
            </div>

            {showAbstract && (
              <div className={styles.abstractSection}>
                <h4 className={styles.abstractTitle}>Abstract</h4>
                <div className={styles.abstractContent}>
                  {paperData.abstract.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={styles.abstractParagraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                <div className={styles.keywords}>
                  <h5 className={styles.keywordsTitle}>Keywords</h5>
                  <div className={styles.keywordsList}>
                    {paperData.keywords.map((keyword, index) => (
                      <span key={index} className={styles.keyword}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className={styles.paperSidebar}>
          <Card className={styles.statsCard}>
            <Card.Header>
              <h4 className="text-heading-4">Paper Statistics</h4>
            </Card.Header>
            <Card.Content>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{paperData.citationCount}</span>
                  <span className={styles.statLabel}>Citations</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{paperData.downloadCount}</span>
                  <span className={styles.statLabel}>Downloads</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{paperData.publishedDate}</span>
                  <span className={styles.statLabel}>Published</span>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className={styles.doiCard}>
            <Card.Header>
              <h4 className="text-heading-4">DOI</h4>
            </Card.Header>
            <Card.Content>
              <div className={styles.doiInfo}>
                <code className={styles.doiCode}>{paperData.doi}</code>
                <Button 
                  variant="ghost" 
                  size="small"
                  onClick={() => navigator.clipboard.writeText(paperData.doi)}
                >
                  Copy DOI
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResearchPaper;