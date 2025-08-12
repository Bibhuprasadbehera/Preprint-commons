import React from 'react';
import Layout from '../components/layout/Layout/Layout';
import styles from '../components/layout/Layout/Layout.module.css';

const About = () => {
  return (
    <Layout>
      <div className={styles.pageContainer}>
        <div className={`${styles.contentSection} animate-fadeInUp`}>
          <h1 className="text-heading-1">About Preprint Commons</h1>
          <div className="mt-4">
            <p className="text-body-large mb-4">
              Preprint Commons is dedicated to providing comprehensive analysis and insights 
              into the global preprint landscape. We track, analyze, and visualize preprint 
              data from major repositories to help researchers understand trends, collaborations, 
              and the impact of open science.
            </p>
            <p className="text-body mb-4">
              Our platform aggregates data from leading preprint servers including medRxiv, 
              bioRxiv, and arXiv, using advanced AI to enrich metadata and provide meaningful 
              insights into the research ecosystem.
            </p>
            <p className="text-body">
              Whether you're a researcher looking to understand your field's trends, a policy 
              maker seeking data-driven insights, or an institution tracking research output, 
              Preprint Commons provides the tools and data you need.
            </p>
          </div>
        </div>
        
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-1`}>
          <h2 className="text-heading-2 mb-4">Our Mission</h2>
          <p className="text-body mb-4">
            To democratize access to preprint analytics and foster a deeper understanding 
            of how open science is shaping the future of research collaboration and knowledge sharing.
          </p>
        </div>
        
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-2`}>
          <h2 className="text-heading-2 mb-4">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card card-content animate-fadeInUp animate-delay-3">
              <h3 className="text-heading-4 mb-2">Global Coverage</h3>
              <p className="text-body">
                Comprehensive data from major preprint repositories worldwide
              </p>
            </div>
            <div className="card card-content animate-fadeInUp animate-delay-3">
              <h3 className="text-heading-4 mb-2">AI-Enhanced Metadata</h3>
              <p className="text-body">
                Advanced language models extract and enrich missing information
              </p>
            </div>
            <div className="card card-content animate-fadeInUp animate-delay-4">
              <h3 className="text-heading-4 mb-2">Interactive Visualizations</h3>
              <p className="text-body">
                Dynamic charts, maps, and dashboards for data exploration
              </p>
            </div>
            <div className="card card-content animate-fadeInUp animate-delay-4">
              <h3 className="text-heading-4 mb-2">Real-time Updates</h3>
              <p className="text-body">
                Continuously updated data ensuring the latest insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;