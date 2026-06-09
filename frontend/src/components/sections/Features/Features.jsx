import React from 'react';
import styles from './Features.module.css';

const Features = () => {
  const mainFeatures = [
    {
      icon: '🌍',
      title: 'Global Trends',
      description: 'Analyze preprint growth by country, institution, and field. Track the evolution of preprints across different regions and disciplines.'
    },
    {
      icon: '📊',
      title: 'Interactive Visualizations',
      description: 'Explore dynamic charts and maps. Dive deep into data with intuitive and responsive visualization tools.'
    },
    {
      icon: '🔬',
      title: 'Open Science Impact',
      description: 'Compare citations and peer-reviewed publication rates. Understand the real impact of preprints on scientific discourse.'
    }
  ];

  const additionalFeatures = [
    {
      icon: '📍',
      title: 'Geographic Insights',
      description: 'Discover research hotspots and regional trends'
    },
    {
      icon: '🔍',
      title: 'Advanced Search',
      description: 'Find specific preprints, authors, or institutions quickly'
    },
    {
      icon: '📈',
      title: 'Trend Analysis',
      description: 'Visualize trend, research areas and hot topics'
    },
    {
      icon: '🤖',
      title: 'AI-Enhanced Metadata',
      description: 'Automated extraction of affiliations and country information'
    },
    {
      icon: '📑',
      title: 'Citation Tracking',
      description: 'Monitor citation patterns'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Access data insights on any device, anywhere'
    },
    {
      icon: '🔒',
      title: 'Source-Available',
      description: 'Code is open for inspection and pull requests'
    }
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Powerful Features with Deeper Insights</h2>
          <p className={styles.subtitle}>
            Comprehensive visualizations designed to help researchers and 
            institutions to understand the preprint landscape.
          </p>
        </div>

        <div className={styles.grid}>
          {mainFeatures.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <span>{feature.icon}</span>
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.additionalFeatures}>
          <div className={styles.additionalGrid}>
            {additionalFeatures.map((feature, index) => (
              <div key={index} className={styles.miniFeature}>
                <div className={styles.miniIcon}>
                  <span>{feature.icon}</span>
                </div>
                <div className={styles.miniContent}>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;