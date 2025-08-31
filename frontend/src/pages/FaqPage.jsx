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
      question: "What is Preprint Commons and what makes it unique?",
      answer: "Preprint Commons is the first dedicated database and analytical platform for large-scale preprint meta-analysis, featuring over 344,000 curated preprints. Built on rigorous academic research by Bibhu Prasad Behera and Binay Panda with institutional support from JNU and C-DAC, it addresses the critical gap in preprint ecosystem analysis through AI-enhanced metadata extraction and comprehensive visualization tools.",
      category: "General"
    },
    {
      question: "Which preprint repositories are included in your database?",
      answer: "Our database includes 344,843 preprints from three major repositories: bioRxiv (239,847 entries), medRxiv (55,695 entries), and arXiv q-bio section (49,301 entries). We focused on these sources due to their consistent, high-quality metadata available via robust APIs and thematic focus on life sciences.",
      category: "Data Sources"
    },
    {
      question: "How do you use AI to enhance the preprint metadata?",
      answer: "We employ the NVIDIA/Llama-3.1-Nemotron-70B-Instruct-HF model deployed across 8 A100-SXM4 GPUs to extract missing author affiliations and geographic information. The LLM processes the first two pages of each preprint using structured prompts to return JSON-formatted data including corresponding author details, affiliations, countries, and email addresses.",
      category: "Technical"
    },
    {
      question: "What are the known limitations of your data processing?",
      answer: "We maintain transparency about our limitations: LLM processing is restricted to the first two pages due to computational constraints, which can result in 10-15% error rates when affiliations are located beyond this range. The model may also hallucinate plausible but incorrect information when relevant context is missing. We're working on securing resources for full-text processing in future iterations.",
      category: "Quality Control"
    },
    {
      question: "How accurate is your data and how do you validate it?",
      answer: "Random sampling validation reveals 85-90% overall accuracy with a 10-15% error rate. We conduct comprehensive quality control through random sampling approaches due to the computational infeasibility of manual validation for all 344,000+ records. Primary error sources include LLM processing constraints and input truncation limitations.",
      category: "Quality Control"
    },
    {
      question: "What technical infrastructure powers Preprint Commons?",
      answer: "Our platform uses a modern full-stack architecture: FastAPI backend with PostgreSQL database, React 19 frontend with Chart.js and D3.js visualizations, and high-performance computing infrastructure including 8 A100-SXM4 GPUs for AI processing. We provide 20+ RESTful API endpoints with automatic OpenAPI documentation generation.",
      category: "Technical"
    },
    {
      question: "How often is your database updated?",
      answer: "Currently, our dataset includes preprints up to June 2024, with plans for quarterly updates. The research paper mentions a biennial refresh cycle to ensure the latest insights are incorporated while balancing computational resources and data quality maintenance.",
      category: "Data Sources"
    },
    {
      question: "Can I access the complete dataset programmatically?",
      answer: "Yes! In strict alignment with open science principles, we provide comprehensive public REST API access built using FastAPI. The API supports complex filtering, sorting, field selection, and pagination, returning structured JSON data. For large-scale analysis, the complete dataset is available for bulk download in JSON and CSV formats.",
      category: "Access"
    },
    {
      question: "What research applications does Preprint Commons support?",
      answer: "Our platform enables various research applications including disciplinary adoption rate analysis, collaboration network mapping, geographic distribution studies, temporal trend modeling, comparative citation analysis, institutional impact assessment, and policy development for research funding and evaluation.",
      category: "Research Applications"
    },
    {
      question: "Who are the researchers behind Preprint Commons?",
      answer: "Preprint Commons was developed by Bibhu Prasad Behera and Binay Panda, with institutional support from Jawaharlal Nehru University (JNU) and Centre for Development of Advanced Computing (C-DAC). The work includes acknowledgments to Ms. Neeraja K M for LLM script assistance and Sibabrata for backend prototyping.",
      category: "Research Team"
    },
    {
      question: "How does your platform contribute to open science?",
      answer: "Preprint Commons promotes transparency and collaboration by providing free access to comprehensive preprint analytics, enabling researchers to quantify the impact and evolution of preprints, and delivering actionable evidence for the scientific community's commitment to equity, transparency, and collaborative progress in scholarly communication.",
      category: "Open Science"
    },
    {
      question: "What future developments are planned for the platform?",
      answer: "Future development priorities include implementing author network analysis for collaboration mapping, developing content-based recommendation systems, enhancing metadata integration for less structured servers, employing topic modeling for research theme evolution tracking, and securing resources for full-text LLM processing to improve data accuracy.",
      category: "Future Development"
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