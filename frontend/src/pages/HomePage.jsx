import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Hero from '../components/sections/Hero/Hero';
import Features from '../components/sections/Features/Features';
import Card from '../components/ui/Card/Card';
import MapContainer from '../components/ui/MapContainer/MapContainer';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [citationTab, setCitationTab] = useState('apa');
  const [copied, setCopied] = useState(false);

  const citationData = {
    apa: `Behera, B. P., & Panda, B. (2026). Preprint Commons: A platform for the systematic tracking of preprint trends and impact. bioRxiv, 2026.05.27.727227. https://doi.org/10.64898/2026.05.27.727227`,
    
    bibtex: `@article{Behera2026.05.27.727227,
  author = {Behera, Bibhu Prasad and Panda, Binay},
  title = {Preprint Commons: A platform for the systematic tracking of preprint trends and impact},
  elocation-id = {2026.05.27.727227},
  year = {2026},
  doi = {10.64898/2026.05.27.727227},
  publisher = {Cold Spring Harbor Laboratory},
  journal = {bioRxiv},
  url = {https://preprintcommons.online/},
  abstract = {Preprints are freely accessible full scientific articles deposited in preprint servers and are made available within a few days of submission, enabling faster dissemination of research findings ahead of formal peer review. Preprints allow researchers to share scientific results early, are citable, and enable authors to receive feedback from a wider community of researchers before any peer review process. Despite their importance, the wider and faster adoption of preprints across the globe, especially in the Global South, has been slow. One reason is the absence of a comprehensive and centralized platform that allows monitoring preprint trends, tracking their usage over time across disciplines, and understanding how they foster collaboration and advance open science. Here, we present Preprint Commons, a dedicated and versatile database and analytical platform for large-scale preprint meta-analysis. Preprint Commons is built with nearly 350,000 life sciences preprints, each annotated with metadata, including that obtained using large language models, to provide trends, citation counts, and geographic distribution. Preprint Commons generates interactive visualizations and provides analysis of preprints, aiding in tracking the lifecycles of preprints and identifying emerging research trends across disciplines and geographies. Preprint Commons supports applications beyond basic analysis, including dynamic visualization, a robust API, and detailed documentation. The database and underlying data are openly accessible at https://preprintcommons.online. Competing Interest Statement: The authors have declared no competing interest.}
}`,

    ris: `TY  - JOUR
T1  - Preprint Commons: A platform for the systematic tracking of preprint trends and impact
JF  - bioRxiv
DO  - 10.64898/2026.05.27.727227
SP  - 2026.05.27.727227
AU  - Behera, Bibhu Prasad
AU  - Panda, Binay
Y1  - 2026/01/01
UR  - https://preprintcommons.online/
N2  - Preprints are freely accessible full scientific articles deposited in preprint servers and are made available within a few days of submission, enabling faster dissemination of research findings ahead of formal peer review. Preprints allow researchers to share scientific results early, are citable, and enable authors to receive feedback from a wider community of researchers before any peer review process. Despite their importance, the wider and faster adoption of preprints across the globe, especially in the Global South, has been slow. One reason is the absence of a comprehensive and centralized platform that allows monitoring preprint trends, tracking their usage over time across disciplines, and understanding how they foster collaboration and advance open science. Here, we present Preprint Commons, a dedicated and versatile database and analytical platform for large-scale preprint meta-analysis. Preprint Commons is built with nearly 350,000 life sciences preprints, each annotated with metadata, including that obtained using large language models, to provide trends, citation counts, and geographic distribution. Preprint Commons generates interactive visualizations and provides analysis of preprints, aiding in tracking the lifecycles of preprints and identifying emerging research trends across disciplines and geographies. Preprint Commons supports applications beyond basic analysis, including dynamic visualization, a robust API, and detailed documentation. The database and underlying data are openly accessible at https://preprintcommons.online. Competing Interest Statement: The authors have declared no competing interest.
ER  - `
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(citationData[citationTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Layout>
        <Hero />
        <Features />
        
        {/* Data Snapshot Section */}
        <section className={styles.dataSnapshot}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Preprint Landscape Overview</h2>
              <p className={styles.sectionSubtitle}>
                Explore global distribution of preprints and preprint landscape
              </p>
            </div>
            
            <MapContainer 
              title="Global Preprint Distribution Map"
              showStats={true}
              statsData={[
              ]}
            />
          </div>
        </section>

        {/*archers Say Section */}
        {/* 
        <section className={styles.testimonials}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>What Researchers Say</h2>
              <p className={styles.sectionSubtitle}>
                Discover how Preprint Commons is helping researchers worldwide
              </p>
            </div>
            
            <div className={styles.testimonialsGrid}>
              <Card.Testimonial
                quote="Preprint Commons helped me identify collaboration opportunities in quantum computing research that I never would have found otherwise."
                author="Dr. Sarah Chen, Quantum Physics Researcher"
              />
              
              <Card.Testimonial
                quote="The visualization tools are incredible. I can now track the global impact of my research field in real-time."
                author="Prof. Michael Rodriguez, Computational Biology"
              />
              
              <Card.Testimonial
                quote="As a policy maker, this platform gives me the data I need to understand research trends and make informed decisions."
                author="Dr. Emma Thompson, Science Policy Analyst"
              />
            </div>
          </div>
        </section>
        */}

        {/* How to Cite Section */}
        <section className={styles.citationSection}>
          <div className={styles.container}>
            <h3 className={styles.citationTitle}>How to Cite Preprint Commons</h3>
            
            <div style={{
              width: '100%',
              maxWidth: '900px',
              margin: '1.5rem auto',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'left'
            }}>
              {/* Tab Header */}
              <div style={{
                display: 'flex',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                padding: '0.5rem 1rem 0',
                gap: '0.5rem'
              }}>
                {['apa', 'bibtex', 'ris'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCitationTab(tab)}
                    style={{
                      padding: '0.625rem 1.25rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: citationTab === tab ? '#3b82f6' : '#64748b',
                      backgroundColor: citationTab === tab ? '#ffffff' : 'transparent',
                      border: '1px solid',
                      borderColor: citationTab === tab ? '#e2e8f0 #e2e8f0 transparent' : 'transparent',
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                      cursor: 'pointer',
                      position: 'relative',
                      top: '1px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Content Panel */}
              <div style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                backgroundColor: '#ffffff'
              }}>
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  borderRadius: '8px',
                  padding: '1rem',
                  maxHeight: '250px',
                  overflowY: 'auto'
                }}>
                  {citationTab === 'apa' ? (
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#334155', margin: 0 }}>
                      Behera, B. P., & Panda, B. (2026). Preprint Commons: A platform for the systematic tracking of preprint trends and impact. <em>bioRxiv</em>, 2026.05.27.727227. <a href="https://doi.org/10.64898/2026.05.27.727227" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>https://doi.org/10.64898/2026.05.27.727227</a>
                    </p>
                  ) : (
                    <pre style={{
                      fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#475569',
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all'
                    }}>
                      {citationData[citationTab]}
                    </pre>
                  )}
                </div>

                <button 
                  onClick={handleCopy}
                  style={{
                    alignSelf: 'flex-end',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#3b82f6',
                    backgroundColor: 'transparent',
                    border: '1px solid #3b82f6',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#3b82f6';
                  }}
                >
                  {copied ? 'Copied! ✓' : 'Copy to Clipboard'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Ready to Explore Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to Explore?</h2>
              <p className={styles.ctaDescription}>
                Start discovering insights in the global preprint landscape today.
              </p>
              <div className={styles.ctaButtons}>
                <Link to="/explore" className={styles.ctaButton}>
                  Explore Data
                </Link>
                <Link to="/about" className={styles.ctaButtonSecondary}>
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
    </Layout>
  );
};

export default HomePage;