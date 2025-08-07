import React from 'react';
import styles from './Features.module.css';

const Features = () => {
  const mainFeatures = [
    {
      icon: '🌍',
      title: 'Global Trends',
      description: 'Analyze preprint growth by country, institution, and field. Track the evolution of scientific publishing across different regions and disciplines.'
    },
    {
      icon: '📊',
      title: 'Interactive Visualizations',
      description: 'Explore dynamic charts, maps, and collaboration networks. Dive deep into data with intuitive and responsive visualization tools.'
    },
    {
      icon: '🔬',
      title: 'Open Science Impact',
      description: 'Compare citations and peer-reviewed publication rates. Understand the real impact of preprints on scientific discourse.'
    }
  ];

  const additionalFeatures = [
    {
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'Get the latest preprint data as it becomes available'
    },
    {
      icon: '🔍',
      title: 'Advanced Search',
      description: 'Find specific papers, authors, or institutions quickly'
    },
    {
      icon: '📈',
      title: 'Trend Analysis',
      description: 'Identify emerging research areas and hot topics'
    },
    {
      icon: '🤝',
      title: 'Collaboration Networks',
      description: 'Visualize research collaboration patterns'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Access data insights on any device, anywhere'
    },
    {
      icon: '🔒',
      title: 'Open Data',
      description: 'All data is freely available under CC-BY license'
    }
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Powerful Features for Research Insights</h2>
          <p className={styles.subtitle}>
            Discover comprehensive tools and visualizations designed to help researchers, 
            institutions, and policymakers understand the preprint landscape.
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