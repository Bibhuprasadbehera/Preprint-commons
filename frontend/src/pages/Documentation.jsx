import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Button from '../components/ui/Button/Button';
import Card from '../components/ui/Card/Card';
import CodeBlock from '../components/ui/CodeBlock/CodeBlock';
import ApiEndpoint from '../components/sections/ApiEndpoint/ApiEndpoint';
import DataSourceCard from '../components/sections/DataSourceCard/DataSourceCard';
import MethodologyFlow from '../components/sections/MethodologyFlow/MethodologyFlow';
import ResearchPaper from '../components/sections/ResearchPaper/ResearchPaper';
import styles from './Documentation.module.css';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();

  // Handle hash-based navigation from footer links
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['overview', 'api', 'sources', 'methodology', 'paper'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/country-data',
      description: 'Get preprint counts by country and year',
      parameters: [],
      response: {
        data: [
          {
            country_name: "United States",
            year: "2023",
            count: 45678
          }
        ]
      }
    },
    {
      method: 'GET',
      endpoint: '/papers',
      description: 'Fetch papers by country and year',
      parameters: [
        { name: 'country', type: 'string', required: true, description: 'Country name' },
        { name: 'year', type: 'integer', required: true, description: 'Year (YYYY)' }
      ],
      response: {
        papers: [
          {
            PPC_Id: "PPC_001",
            preprint_title: "Sample Research Paper",
            preprint_doi: "10.1101/2023.01.01.000001",
            country_name: "United States"
          }
        ]
      }
    },
    {
      method: 'GET',
      endpoint: '/search',
      description: 'Search papers by title or DOI',
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'Search query' }
      ],
      response: [
        {
          PPC_Id: "PPC_002",
          preprint_title: "COVID-19 Research Analysis",
          preprint_doi: "10.1101/2023.02.01.000002"
        }
      ]
    },
    {
      method: 'GET',
      endpoint: '/paper/{ppc_id}',
      description: 'Get specific paper details',
      parameters: [
        { name: 'ppc_id', type: 'string', required: true, description: 'Unique paper identifier' }
      ],
      response: {
        PPC_Id: "PPC_001",
        preprint_title: "Sample Research Paper",
        preprint_doi: "10.1101/2023.01.01.000001",
        authors: "John Doe, Jane Smith",
        country_name: "United States"
      }
    }
  ];

  const dataSources = [
    {
      name: 'medRxiv',
      description: 'Medical preprints and health sciences research',
      url: 'https://www.medrxiv.org',
      coverage: '50,000+',
      fields: ['Medicine', 'Health Sciences', 'Public Health'],
      color: '#e74c3c'
    },
    {
      name: 'bioRxiv',
      description: 'Biological sciences preprints',
      url: 'https://www.biorxiv.org',
      coverage: '200,000+',
      fields: ['Biology', 'Neuroscience', 'Bioinformatics'],
      color: '#27ae60'
    },
    {
      name: 'arXiv',
      description: 'Physics, mathematics, and computer science',
      url: 'https://arxiv.org',
      coverage: '2,000,000+',
      fields: ['Physics', 'Mathematics', 'Computer Science'],
      color: '#3498db'
    }
  ];

  return (
    <Layout>
      <div className={styles.documentation}>
        {/* Page Header */}
        <section className={styles.pageHeader}>
          <div className={styles.container}>
            <div className={styles.headerContent}>
              <h1 className={styles.pageTitle}>
                Research Documentation & API Reference
              </h1>
              <p className={styles.pageSubtitle}>
                Comprehensive documentation for Preprint Commons platform including API endpoints, 
                data sources, methodology, and research findings.
              </p>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className={styles.navigation}>
          <div className={styles.container}>
            <div className={styles.tabNav}>
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'api', label: 'API Reference' },
                { id: 'sources', label: 'Data Sources' },
                { id: 'methodology', label: 'Methodology' },
                { id: 'paper', label: 'Research Paper' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    window.history.pushState(null, null, `#${tab.id}`);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className={styles.container}>
          {activeTab === 'overview' && (
            <section className={styles.overview}>
              <div className={styles.overviewGrid}>
                <Card className={styles.overviewCard}>
                  <Card.Header>
                    <h3 className="text-heading-3">Platform Overview</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body">
                      Preprint Commons is a comprehensive platform for analyzing preprint research data 
                      from major repositories worldwide. Our system aggregates, processes, and enriches 
                      metadata using advanced AI techniques.
                    </p>
                  </Card.Content>
                </Card>

                <Card className={styles.overviewCard}>
                  <Card.Header>
                    <h3 className="text-heading-3">Technical Stack</h3>
                  </Card.Header>
                  <Card.Content>
                    <ul className={styles.techList}>
                      <li>FastAPI backend with SQLite database</li>
                      <li>React 19 frontend with modern components</li>
                      <li>Chart.js for data visualization</li>
                      <li>AI-powered metadata enrichment</li>
                    </ul>
                  </Card.Content>
                </Card>

                <Card className={styles.overviewCard}>
                  <Card.Header>
                    <h3 className="text-heading-3">Key Metrics</h3>
                  </Card.Header>
                  <Card.Content>
                    <div className={styles.metrics}>
                      <div className={styles.metric}>
                        <span className={styles.metricNumber}>300K+</span>
                        <span className={styles.metricLabel}>Preprints</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricNumber}>50+</span>
                        <span className={styles.metricLabel}>Countries</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricNumber}>1K+</span>
                        <span className={styles.metricLabel}>Institutions</span>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            </section>
          )}

          {activeTab === 'api' && (
            <section className={styles.apiSection}>
              <div className={styles.sectionHeader}>
                <h2 className="text-heading-2">API Reference</h2>
                <p className="text-body-large">
                  RESTful API endpoints for accessing preprint data and analytics
                </p>
              </div>

              <div className={styles.apiEndpoints}>
                {apiEndpoints.map((endpoint, index) => (
                  <ApiEndpoint key={index} {...endpoint} />
                ))}
              </div>

              <Card className={styles.apiInfo}>
                <Card.Header>
                  <h3 className="text-heading-3">Authentication & Rate Limits</h3>
                </Card.Header>
                <Card.Content>
                  <p className="text-body mb-4">
                    Currently, the API is open and does not require authentication. 
                    Rate limiting may be implemented in future versions.
                  </p>
                  <div className={styles.apiDetails}>
                    <div>
                      <strong>Base URL:</strong> <code>http://localhost:8000</code>
                    </div>
                    <div>
                      <strong>Content Type:</strong> <code>application/json</code>
                    </div>
                    <div>
                      <strong>CORS:</strong> Enabled for development origins
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </section>
          )}

          {activeTab === 'sources' && (
            <section className={styles.sourcesSection}>
              <div className={styles.sectionHeader}>
                <h2 className="text-heading-2">Data Sources</h2>
                <p className="text-body-large">
                  We aggregate data from leading preprint repositories worldwide
                </p>
              </div>

              <div className={styles.sourcesGrid}>
                {dataSources.map((source, index) => (
                  <DataSourceCard key={index} {...source} />
                ))}
              </div>

              <Card className={styles.dataProcessing}>
                <Card.Header>
                  <h3 className="text-heading-3">Data Processing Pipeline</h3>
                </Card.Header>
                <Card.Content>
                  <div className={styles.processingSteps}>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>1</div>
                      <div className={styles.stepContent}>
                        <h4>Data Collection</h4>
                        <p>Automated scraping and API integration with source repositories</p>
                      </div>
                    </div>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>2</div>
                      <div className={styles.stepContent}>
                        <h4>Metadata Enrichment</h4>
                        <p>AI-powered extraction of missing author affiliations and classifications</p>
                      </div>
                    </div>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>3</div>
                      <div className={styles.stepContent}>
                        <h4>Quality Assurance</h4>
                        <p>Validation and deduplication of records across sources</p>
                      </div>
                    </div>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>4</div>
                      <div className={styles.stepContent}>
                        <h4>Database Storage</h4>
                        <p>Structured storage in SQLite with optimized indexing</p>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </section>
          )}

          {activeTab === 'methodology' && (
            <section className={styles.methodologySection}>
              <div className={styles.sectionHeader}>
                <h2 className="text-heading-2">Research Methodology</h2>
                <p className="text-body-large">
                  Our comprehensive approach to preprint data analysis and visualization
                </p>
              </div>

              <MethodologyFlow />

              <div className={styles.methodologyDetails}>
                <Card>
                  <Card.Header>
                    <h3 className="text-heading-3">AI Enhancement Process</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body mb-4">
                      We use advanced natural language processing to extract and enrich metadata 
                      that is often missing from preprint submissions.
                    </p>
                    <div className={styles.aiProcess}>
                      <div className={styles.aiStep}>
                        <h4>Named Entity Recognition</h4>
                        <p>Extract author names, institutions, and locations from text</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Classification</h4>
                        <p>Categorize papers by research field and methodology</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Relationship Mapping</h4>
                        <p>Identify collaboration networks and citation patterns</p>
                      </div>
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <h3 className="text-heading-3">Quality Metrics</h3>
                  </Card.Header>
                  <Card.Content>
                    <div className={styles.qualityMetrics}>
                      <div className={styles.qualityMetric}>
                        <span className={styles.qualityNumber}>95%</span>
                        <span className={styles.qualityLabel}>Accuracy in author extraction</span>
                      </div>
                      <div className={styles.qualityMetric}>
                        <span className={styles.qualityNumber}>88%</span>
                        <span className={styles.qualityLabel}>Institution matching success</span>
                      </div>
                      <div className={styles.qualityMetric}>
                        <span className={styles.qualityNumber}>92%</span>
                        <span className={styles.qualityLabel}>Field classification accuracy</span>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            </section>
          )}

          {activeTab === 'paper' && (
            <section className={styles.paperSection}>
              <ResearchPaper />
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;