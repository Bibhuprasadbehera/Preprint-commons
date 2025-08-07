import React from 'react';
import Layout from '../components/layout/Layout/Layout';
import styles from '../components/layout/Layout/Layout.module.css';

const Contact = () => {
  return (
    <Layout>
      <div className={styles.pageContainer}>
        <div className={styles.contentSection}>
          <h1 className="text-heading-1">Contact Us</h1>
          <div className="mt-4">
            <p className="text-body-large mb-6">
              We'd love to hear from you! Whether you have questions about our data, 
              suggestions for improvements, or collaboration opportunities, don't hesitate to reach out.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className={styles.contentSection}>
            <h2 className="text-heading-3 mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div className="card card-content">
                <h3 className="text-heading-4 mb-2">General Inquiries</h3>
                <p className="text-body mb-2">
                  For general questions about Preprint Commons
                </p>
                <a href="mailto:contact@preprintcommons.org" className="text-primary hover:text-primary-dark">
                  contact@preprintcommons.org
                </a>
              </div>
              
              <div className="card card-content">
                <h3 className="text-heading-4 mb-2">Technical Support</h3>
                <p className="text-body mb-2">
                  For technical issues or API questions
                </p>
                <a href="mailto:support@preprintcommons.org" className="text-primary hover:text-primary-dark">
                  support@preprintcommons.org
                </a>
              </div>
              
              <div className="card card-content">
                <h3 className="text-heading-4 mb-2">Partnerships</h3>
                <p className="text-body mb-2">
                  For collaboration and partnership opportunities
                </p>
                <a href="mailto:partnerships@preprintcommons.org" className="text-primary hover:text-primary-dark">
                  partnerships@preprintcommons.org
                </a>
              </div>
            </div>
          </div>
          
          <div className={styles.contentSection}>
            <h2 className="text-heading-3 mb-4">Connect With Us</h2>
            <div className="space-y-4">
              <div className="card card-content">
                <h3 className="text-heading-4 mb-2">Social Media</h3>
                <div className="flex gap-4 mt-3">
                  <a href="https://twitter.com/preprintcommons" className="text-primary hover:text-primary-dark">
                    Twitter
                  </a>
                  <a href="https://github.com/preprintcommons" className="text-primary hover:text-primary-dark">
                    GitHub
                  </a>
                  <a href="https://linkedin.com/company/preprintcommons" className="text-primary hover:text-primary-dark">
                    LinkedIn
                  </a>
                </div>
              </div>
              
              <div className="card card-content">
                <h3 className="text-heading-4 mb-2">Newsletter</h3>
                <p className="text-body mb-3">
                  Stay updated with the latest features and insights
                </p>
                <button className="btn btn-primary">
                  Subscribe to Updates
                </button>
              </div>
              
              <div className="card card-content">
                <h3 className="text-heading-4 mb-2">Community</h3>
                <p className="text-body mb-3">
                  Join our community of researchers and data enthusiasts
                </p>
                <button className="btn btn-outline">
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.contentSection}>
          <div className="card card-content text-center">
            <h2 className="text-heading-3 mb-4">Office Hours</h2>
            <p className="text-body">
              Our team is available Monday through Friday, 9:00 AM to 5:00 PM (UTC).
              We typically respond to emails within 24 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;