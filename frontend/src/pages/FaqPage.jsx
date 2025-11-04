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
      answer: "Preprint Commons is the first dedicated database and analytical platform for large-scale preprint meta-analysis, featuring over 344,000 curated preprints. Built on rigorous academic research, it addresses the critical gap in preprint ecosystem through analysis, AI-enhanced metadata extraction and comprehensive visualization tools.",
      category: "General"
    },
    {
      question: "Which preprint repositories are included in the database?",
      answer: "Preprint Commons includes 344,843 preprints from three repositories: bioRxiv (239,847 entries), medRxiv (55,695 entries), and arXiv q-bio section (49,301 entries). We focused on these sources due to their consistent, high-quality metadata availablibility via robust APIs and thematic focus on life sciences.",
      category: "General"
    },
    {
      question: "How does Preprint Commons use AI to enhance meta-analysis?",
      answer: "The database employs the NVIDIA/Llama-3.1-Nemotron-70B-Instruct-HF model deployed across 8 A100-SXM4 GPUs to extract missing author affiliations and geographic information for arXiv (Q-bio) repository. The LLM processes the first two pages of each preprint using structured prompts to return JSON-formatted data including corresponding author details, affiliations, countries, and email addresses.",
      category: "Technical"
    },
    {
      question: "Does Preprint Commons use LLM for all the preprints?",
      answer: "No, LLM processing is specifically applied to arXiv (Q-bio) preprints to extract missing author affiliation and geographic data. For bioRxiv and medRxiv preprints, JATS XML was used to extract the relevant information.",
      category: "Technical"
    },
    {
      question: "What is JATS XML and how is it used in Preprint Commons?",
      answer: "JATS (Journal Article Tag Suite) XML is a standardized XML format for representing scholarly articles and their metadata. bioRxiv and medRxiv provide preprint metadata in JATS XML format, which includes structured information about authors, affiliations, institutions, and other bibliographic details. Preprint Commons parses this JATS XML to extract corresponding author affiliations and country information directly, eliminating the need for LLM processing for these repositories. This provides higher accuracy and consistency compared to unstructured text extraction.",
      category: "Technical"
    },
    {
      question: "Why is JATS XML preferred over LLM extraction when available?",
      answer: "JATS XML provides structured, machine-readable metadata that can be parsed with near-perfect accuracy using rule-based methods. Unlike LLM processing which may hallucinate or miss information, JATS XML parsing is deterministic and reliable. For bioRxiv and medRxiv, JATS XML contains comprehensive author affiliation data in a standardized format, making it the preferred method for metadata extraction. LLM processing is only used for arXiv (q-bio) where JATS XML is not available.",
      category: "Technical"
    },
    {
      question: "What are the known limitations of your data processing?",
      answer: "LLM processing is restricted to the first two pages due to computational constraints. The model may hallucinate resulting in incorrect information on Author affiliation and geographic information for some preprints. Missing fields and undocumented errors may result in incomplete or partially complete data in some cases.",
      category: "Quality Control"
    },
    {
      question: "How accurate is the underlying data?",
      answer: "As manual validation for 344,843 preprints was not possible, we performed random sampling that yielded 85-90% overall accuracy. ",
      category: "Quality Control"
    },
    {
      question: "What technical infrastructure powers Preprint Commons?",
      answer: "Preprint Commons platform uses a modern full-stack architecture: FastAPI backend with PostgreSQL database, React 19 frontend with Chart.js and D3.js visualizations, and high-performance computing infrastructure including 8 A100-SXM4 GPUs for AI processing. We provide 20+ RESTful API endpoints with automatic OpenAPI documentation.",
      category: "Technical"
    },
    {
      question: "Can I access the complete dataset programmatically?",
      answer: "Yes! In strict alignment with open science principles, we provide comprehensive public REST API access built using FastAPI. The API supports complex filtering, sorting, field selection, and pagination, returning structured JSON data. For large-scale analysis, the complete dataset is available for bulk download in JSON and CSV formats.",
      category: "Technical"
    },
    {
      question: "What research applications does Preprint Commons support?",
      answer: "Preprint Commons enables various research applications including subject-specific analysis, preprint distribution in different geographies, trend and citation analysis.",
      category: "Open science"
    },
    {
      question: "How does your platform contribute to open science?",
      answer: "Preprint Commons promotes transparency and collaboration by providing free access to comprehensive preprint analytics. The database enables researchers to quantify the impact and evolution of preprints.",
      category: "Open science"
    },
    {
      question: "What future developments are planned for the platform?",
      answer: "Future development will include implementing author network analysis for collaboration, enhancing metadata integration for additional preprint servers, employing subject based modeling and full-text processing using future generation LLMs to improve data accuracy.",
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
            Find answers to common questions about Preprint Commons, the underlying data and how to use the platform effectively.
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
              Still have questions?
            </h2>
            <p className="text-body" style={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: 'var(--spacing-xl)',
              maxWidth: '500px',
              margin: '0 auto var(--spacing-xl)'
            }}>
              Can't find what you're looking for? 
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
              Contact us
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FaqPage;