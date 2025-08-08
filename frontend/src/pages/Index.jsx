import React from 'react';
import Layout from '../components/layout/Layout/Layout';
import Hero from '../components/sections/Hero/Hero';
import Features from '../components/sections/Features/Features';
import Card from '../components/ui/Card/Card';
import MapContainer from '../components/ui/MapContainer/MapContainer';
import { Link } from 'react-router-dom';
import styles from './Index.module.css';

const Index = () => {
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
                Explore the global distribution of preprints and discover research hotspots worldwide
              </p>
            </div>
            
            <MapContainer 
              title="Global Preprint Distribution Map"
              showStats={true}
              statsData={[
                { number: "300,000+", label: "Preprints Indexed" },
                { number: "50+", label: "Countries Contributing" },
                { number: "1,000+", label: "Institutions Tracked" }
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
                  We aggregate preprints from major repositories including medRxiv, bioRxiv, 
                  and q-bio sections of arXiv, ensuring comprehensive coverage.
                </p>
              </div>
              
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>02</div>
                <h3 className={styles.stepTitle}>AI-Powered Enrichment</h3>
                <p className={styles.stepDescription}>
                  Advanced language models extract missing metadata such as author affiliations, 
                  funding information, and research classifications.
                </p>
              </div>
              
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>03</div>
                <h3 className={styles.stepTitle}>Interactive Visualization</h3>
                <p className={styles.stepDescription}>
                  Explore insights through dynamic dashboards, interactive maps, 
                  and comprehensive analytics tools designed for researchers.
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
    </Layout>
  );
};

export default Index;