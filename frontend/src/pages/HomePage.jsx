import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Hero from '../components/sections/Hero/Hero';
import Features from '../components/sections/Features/Features';
import Card from '../components/ui/Card/Card';
import MapContainer from '../components/ui/MapContainer/MapContainer';
import styles from './HomePage.module.css';

const HomePage = () => {
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

        {/* How It Works Section */}
        <section className={styles.howItWorks}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>How It Works</h2>
              <p className={styles.sectionSubtitle}>
                Our comprehensive approach to tracking and analyzing preprint data
              </p>
            </div>
            
            <div className={styles.processGrid}>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>01</div>
                <h3 className={styles.stepTitle}>Data Collection</h3>
                <p className={styles.stepDescription}>
                  We aggregate preprints from medRxiv, bioRxiv, 
                  and q-bio section of arXiv ensuring comprehensive coverage.
                </p>
              </div>
              
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>02</div>
                <h3 className={styles.stepTitle}>AI-Powered Enrichment</h3>
                <p className={styles.stepDescription}>
                   Large Language Model was used to fill missing metadata such as author affiliations, 
                   and country information.
                </p>
              </div>
              
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>03</div>
                <h3 className={styles.stepTitle}>Interactive Visualization</h3>
                <p className={styles.stepDescription}>
                  Explore insights through dynamic dashboards, interactive maps, 
                  and comprehensive visualization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
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

        {/* How to Cite Section */}
        <section className={styles.citationSection}>
          <div className={styles.container}>
            <h3 className={styles.citationTitle}>How to Cite Preprint Commons</h3>
            
            <div className={styles.citationGrid}>
              <div className={styles.citationCard}>
                <span className={styles.citationFormat}>APA</span>
                <p className={styles.citationText}>
                  Preprint Commons. (2024). <em>Preprint Commons</em>. https://preprintcommons.org
                </p>
                <button 
                  className={styles.citationCopy}
                  onClick={() => {
                    navigator.clipboard.writeText('Preprint Commons. (2024). Preprint Commons. https://preprintcommons.org');
                  }}
                  title="Copy citation"
                >
                  Copy
                </button>
              </div>
              
              <div className={styles.citationCard}>
                <span className={styles.citationFormat}>BibTeX</span>
                <pre className={styles.citationText}>
{`@misc{preprintcommons2024,
  author = {Preprint Commons},
  title = {Preprint Commons},
  year = {2024},
  url = {https://preprintcommons.org}
}`}
                </pre>
                <button 
                  className={styles.citationCopy}
                  onClick={() => {
                    navigator.clipboard.writeText(`@misc{preprintcommons2024,\n  author = {Preprint Commons},\n  title = {Preprint Commons},\n  year = {2024},\n  url = {https://preprintcommons.org}\n}`);
                  }}
                  title="Copy citation"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
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