import React, { useState } from 'react';
import Layout from '../components/layout/Layout/Layout';
import styles from '../components/layout/Layout/Layout.module.css';

const Faq = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Preprint Commons?",
      answer: "Preprint Commons is a comprehensive platform that tracks, analyzes, and visualizes preprint data from major repositories worldwide. We provide insights into research trends, collaborations, and the impact of open science."
    },
    {
      question: "Which preprint servers do you track?",
      answer: "We aggregate data from major preprint repositories including medRxiv, bioRxiv, arXiv (q-bio sections), and other leading platforms. Our coverage continues to expand as new repositories emerge."
    },
    {
      question: "How often is the data updated?",
      answer: "Our data is updated daily to ensure you have access to the most current information. We continuously monitor preprint servers for new submissions and updates to existing papers."
    },
    {
      question: "Is the data freely available?",
      answer: "Yes! Preprint Commons is committed to open science. Our data and insights are freely available under a CC-BY license, promoting transparency and collaboration in the research community."
    },
    {
      question: "How do you handle missing metadata?",
      answer: "We use advanced AI and language models to extract and enrich missing metadata such as author affiliations, funding information, and research classifications. This ensures comprehensive and accurate data representation."
    },
    {
      question: "Can I access the data programmatically?",
      answer: "Yes, we provide a comprehensive API that allows researchers and developers to access our data programmatically. Documentation and examples are available in our API section."
    },
    {
      question: "How can I contribute to the project?",
      answer: "We welcome contributions from the research community! You can contribute by reporting data issues, suggesting new features, or participating in our open-source development on GitHub."
    },
    {
      question: "What makes your platform different?",
      answer: "Our platform combines comprehensive data coverage with AI-enhanced metadata extraction and interactive visualizations. We focus on providing actionable insights for researchers, institutions, and policymakers."
    }
  ];

  return (
    <Layout>
      <div className={styles.pageContainer}>
        <div className={styles.contentSection}>
          <h1 className="text-heading-1">Frequently Asked Questions</h1>
          <p className="text-body-large mt-4 mb-6">
            Find answers to common questions about Preprint Commons, our data, and how to use our platform effectively.
          </p>
        </div>
        
        <div className={styles.contentSection}>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <button
                  className="w-full text-left card-content flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-heading-4 pr-4">{faq.question}</h3>
                  <span className="text-2xl text-primary">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="card-content border-t border-neutral-200">
                    <p className="text-body">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.contentSection}>
          <div className="card card-content text-center">
            <h2 className="text-heading-3 mb-4">Still Have Questions?</h2>
            <p className="text-body mb-4">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <button className="btn btn-primary">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Faq;