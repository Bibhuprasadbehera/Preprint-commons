import React from 'react';
import Card from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import styles from './ResearchPaper.module.css';

const ResearchPaper = () => {
  const researchData = {
    title: "Preprint Commons: A Database for Tracking Trends, Impact, and Collaboration in Open Science",
    authors: [
      "Bibhu Prasad Behera",
      "Binay Panda"
    ],
    affiliations: [
      "Jawaharlal Nehru University (JNU)",
      "Centre for Development of Advanced Computing (C-DAC)"
    ],
    abstract: `Preprint Commons addresses the critical gap in preprint ecosystem analysis by providing a centralized platform for large-scale meta-analysis. Our systematic approach combines data acquisition from major repositories with AI-powered enhancement to create comprehensive insights into the global preprint landscape.

The platform leverages advanced computational tools and large language models to generate interactive visualizations and analytical insights, supporting various applications from bibliometric analysis to research policy development and institutional collaboration mapping.`,
    keyContributions: [
      "First dedicated database for large-scale preprint meta-analysis",
      "Systematic data acquisition from major life sciences repositories",
      "AI-powered metadata enhancement using advanced language models",
      "Comprehensive visualization and analytical platform",
      "Open access approach promoting transparency in research"
    ],
    acknowledgments: [
      "Jawaharlal Nehru University (JNU) for institutional support",
      "Centre for Development of Advanced Computing (C-DAC) for HPC facilities",
      "Ms. Neeraja K M for LLM script assistance",
      "Sibabrata for backend prototyping"
    ]
  };

  const handleAccessPlatform = () => {
    window.open('/', '_blank');
  };

  return (
    <div className={styles.researchPaper}>
      <div className={styles.sectionHeader}>
        <h2 className="text-heading-2">Research Foundation</h2>
        <p className="text-body-large">
          Academic research and development behind Preprint Commons
        </p>
      </div>

      <div className={styles.paperContainer}>
        <div className={styles.paperMain}>
          <Card className={styles.paperCard}>
            <div className={styles.paperHeader}>
              <div className={styles.paperPreview}>
                <div className={styles.researchIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className={styles.iconSvg}>
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                </div>
                <div className={styles.paperOverlay}>
                  <div className={styles.researchBadge}>
                    <span className={styles.badgeText}>Research Paper</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.paperInfo}>
                <h3 className={styles.paperTitle}>{researchData.title}</h3>
                
                <div className={styles.authors}>
                  <h4 className={styles.authorsTitle}>Research Team</h4>
                  <div className={styles.authorsList}>
                    {researchData.authors.map((author, index) => (
                      <span key={index} className={styles.author}>
                        {author}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.affiliations}>
                  <h4 className={styles.affiliationsTitle}>Institutional Support</h4>
                  <div className={styles.affiliationsList}>
                    {researchData.affiliations.map((affiliation, index) => (
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
                    onClick={handleAccessPlatform}
                  >
                    Access Platform
                  </Button>
                </div>
              </div>
            </div>

            <div className={styles.abstractSection}>
              <h4 className={styles.abstractTitle}>Research Overview</h4>
              <div className={styles.abstractContent}>
                {researchData.abstract.split('\n\n').map((paragraph, index) => (
                  <p key={index} className={styles.abstractParagraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <div className={styles.contributions}>
                <h5 className={styles.contributionsTitle}>Key Contributions</h5>
                <ul className={styles.contributionsList}>
                  {researchData.keyContributions.map((contribution, index) => (
                    <li key={index} className={styles.contribution}>
                      {contribution}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.acknowledgments}>
                <h5 className={styles.acknowledgementsTitle}>Acknowledgments</h5>
                <ul className={styles.acknowledgmentsList}>
                  {researchData.acknowledgments.map((ack, index) => (
                    <li key={index} className={styles.acknowledgment}>
                      {ack}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <div className={styles.paperSidebar}>
          <Card className={styles.accessCard}>
            <Card.Header>
              <h4 className="text-heading-4">Open Science Access</h4>
            </Card.Header>
            <Card.Content>
              <div className={styles.accessInfo}>
                <p className={styles.accessDescription}>
                  Platform and data available for the research community
                </p>
                <div className={styles.accessFeatures}>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>🔓</span>
                    <span className={styles.featureText}>Open Access</span>
                  </div>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>📊</span>
                    <span className={styles.featureText}>Interactive Analytics</span>
                  </div>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>🌐</span>
                    <span className={styles.featureText}>Global Coverage</span>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  size="small"
                  onClick={() => window.open('/documentation', '_blank')}
                  style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                >
                  View Documentation
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