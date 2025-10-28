import React from 'react';
import Card from '../../ui/Card/Card';
import styles from './MethodologyFlow.module.css';

const MethodologyFlow = () => {
  const steps = [
    {
      id: 1,
      title: 'Data Collection',
      description: 'Scraping and API integration with preprint repositories',
      details: [
        'Synchronization with medRxiv, bioRxiv, and arXiv',
        'Metadata extraction and standardization',
        'Duplicate detection and removal'
      ],
      icon: '📥'
    },
    {
      id: 2,
      title: 'AI Enhancement',
      description: 'Machine learning models extract missing information',
      details: [
        'Named entity recognition for authors and institutions',
        'Geographic location mapping',
        'Research field classification'
      ],
      icon: '🤖'
    },
    {
      id: 3,
      title: 'Quality Assurance',
      description: 'Validation and verification of enriched data',
      details: [
        'Cross-reference validation',
        'Statistical outlier detection',
        'Manual review of edge cases'
      ],
      icon: '✅'
    },
    {
      id: 4,
      title: 'Database Storage',
      description: 'Structured storage with optimized indexing',
      details: [
        'SQLite database with full-text search',
        'Optimized queries for analytics',
        'Regular backup and maintenance'
      ],
      icon: '🗄️'
    },
    {
      id: 5,
      title: 'Visualization',
      description: 'Interactive dashboards and analytics tools',
      details: [
        'Real-time chart generation',
        'Geographic mapping',
        'Trend analysis and forecasting'
      ],
      icon: '📊'
    }
  ];

  return (
    <div className={styles.methodologyFlow}>
      <div className={styles.flowContainer}>
        {steps.map((step, index) => (
          <div key={step.id} className={styles.stepContainer}>
            <div className={styles.stepCard}>
              <Card className={styles.card}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepIcon}>
                    <span>{step.icon}</span>
                  </div>
                  <div className={styles.stepNumber}>{step.id}</div>
                </div>
                
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                  
                  <ul className={styles.stepDetails}>
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className={styles.stepDetail}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
            
            {index < steps.length - 1 && (
              <div className={styles.connector}>
                <div className={styles.arrow}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default MethodologyFlow;