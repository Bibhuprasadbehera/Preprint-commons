import React, { useState } from 'react';
import Layout from '../components/layout/Layout/Layout';
import styles from '../components/layout/Layout/Layout.module.css';

const FaqPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Preprint Commons?",
      answer: "Preprint Commons is a comprehensive platform that tracks, analyzes, and visualizes preprint data from major repositories worldwide. We provide insights into research trends, collaborations, and the impact of open science.",
      category: "General"
    },
    {
      question: "Which preprint servers do you track?",
      answer: "We aggregate data from major preprint repositories including medRxiv, bioRxiv, arXiv (q-bio sections), and other leading platforms. Our coverage continues to expand as new repositories emerge.",
      category: "Data Sources"
    },
    {
      question: "How often is the data updated?",
      answer: "Our data is updated daily to ensure you have access to the most current information. We continuously monitor preprint servers for new submissions and updates to existing papers.",
      category: "Data Sources"
    },
    {
      question: "Is the data freely available?",
      answer: "Yes! Preprint Commons is committed to open science. Our data and insights are freely available under a CC-BY license, promoting transparency and collaboration in the research community.",
      category: "Access"
    },
    {
      question: "How do you handle missing metadata?",
      answer: "We use advanced AI and language models to extract and enrich missing metadata such as author affiliations, funding information, and research classifications. This ensures comprehensive and accurate data representation.",
      category: "Technical"
    },
    {
      question: "Can I access the data programmatically?",
      answer: "Yes, we provide a comprehensive API that allows researchers and developers to access our data programmatically. Documentation and examples are available in our API section.",
      category: "Technical"
    },
    {
      question: "How can I contribute to the project?",
      answer: "We welcome contributions from the research community! You can contribute by reporting data issues, suggesting new features, or participating in our open-source development on GitHub.",
      category: "Community"
    },
    {
      question: "What makes your platform different?",
      answer: "Our platform combines comprehensive data coverage with AI-enhanced metadata extraction and interactive visualizations. We focus on providing actionable insights for researchers, institutions, and policymakers.",
      category: "General"
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <Layout>
      <div className={styles.pageContainer}>
        {/* Hero Section */}
        <div className={`${styles.contentSection} animate-fadeInUp`} style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          color: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-3xl)',
          marginBottom: 'var(--spacing-3xl)',
          textAlign: 'center'
        }}>
          <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--spacing-lg)' }}>
            Frequently Asked Questions
          </h1>
          <p className="text-body-large" style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            maxWidth: '700px', 
            margin: '0 auto',
            lineHeight: 'var(--line-height-relaxed)'
          }}>
            Find answers to common questions about Preprint Commons, our data, and how to use our platform effectively.
          </p>
        </div>

        {/* FAQ Categories */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 'var(--spacing-md)', 
            justifyContent: 'center',
            marginBottom: 'var(--spacing-xl)'
          }}>
            {categories.map((category, index) => (
              <div key={category} className="animate-fadeInUp" style={{
                animationDelay: `${index * 0.1}s`,
                background: 'var(--color-bg-secondary)',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-neutral-200)',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                {category}
              </div>
            ))}
          </div>
        </div>
        
        {/* FAQ Items */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-1`}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, index) => (
              <div key={index} className="animate-fadeInUp" style={{
                animationDelay: `${0.2 + index * 0.05}s`,
                marginBottom: 'var(--spacing-lg)'
              }}>
                <div style={{
                  background: 'var(--color-bg-primary)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-neutral-200)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all var(--transition-normal)',
                  overflow: 'hidden'
                }}>
                  <button
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: 'var(--spacing-xl)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all var(--transition-normal)'
                    }}
                    onClick={() => toggleFaq(index)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    <div>
                      <div style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-primary)',
                        fontWeight: 'var(--font-weight-medium)',
                        marginBottom: 'var(--spacing-xs)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {faq.category}
                      </div>
                      <h3 className="text-heading-4" style={{ 
                        color: 'var(--color-text-primary)',
                        margin: 0
                      }}>
                        {faq.question}
                      </h3>
                    </div>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-full)',
                      background: openFaq === index ? 'var(--color-primary)' : 'var(--color-neutral-200)',
                      color: openFaq === index ? 'white' : 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: 'var(--font-weight-bold)',
                      transition: 'all var(--transition-normal)',
                      flexShrink: 0,
                      marginLeft: 'var(--spacing-lg)'
                    }}>
                      {openFaq === index ? '−' : '+'}
                    </div>
                  </button>
                  
                  {openFaq === index && (
                    <div style={{
                      padding: '0 var(--spacing-xl) var(--spacing-xl)',
                      borderTop: '1px solid var(--color-neutral-200)',
                      background: 'var(--color-bg-secondary)',
                      animation: 'fadeInUp 0.3s ease-out'
                    }}>
                      <p className="text-body" style={{ 
                        margin: 0,
                        lineHeight: 'var(--line-height-relaxed)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact Support Section */}
        <div className={`${styles.contentSection} animate-fadeInUp animate-delay-4`}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)',
            color: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-3xl)',
            textAlign: 'center'
          }}>
            <h2 className="text-heading-2" style={{ 
              color: 'white', 
              marginBottom: 'var(--spacing-lg)' 
            }}>
              Still Have Questions?
            </h2>
            <p className="text-body" style={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: 'var(--spacing-xl)',
              maxWidth: '500px',
              margin: '0 auto var(--spacing-xl)'
            }}>
              Can't find what you're looking for? Our team is here to help you get the most out of Preprint Commons.
            </p>
            <button className="btn btn-secondary" style={{
              background: 'white',
              color: 'var(--color-primary)',
              border: 'none',
              padding: 'var(--spacing-md) var(--spacing-2xl)',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-lg)',
              transition: 'all var(--transition-normal)'
            }}>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FaqPage;