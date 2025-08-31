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
import styles from './DocumentationPage.module.css';

const DocumentationPage = () => {
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
      endpoint: '/api/analytics/country-data',
      description: 'Get country-wise paper distribution by year for geographic analysis',
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
      endpoint: '/api/papers/',
      description: 'Fetch papers with comprehensive filtering and pagination',
      parameters: [
        { name: 'country', type: 'string', required: false, description: 'Filter by country name' },
        { name: 'year', type: 'integer', required: false, description: 'Filter by year (YYYY)' },
        { name: 'subject', type: 'string', required: false, description: 'Filter by subject area' },
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (max: 100)' }
      ],
      response: {
        papers: [
          {
            PPC_Id: "PPC_001",
            preprint_title: "Sample Research Paper",
            preprint_doi: "10.1101/2023.01.01.000001",
            total_citation: 156,
            preprint_submission_date: "2023-01-01",
            all_authors: "John Doe, Jane Smith",
            preprint_subject: "bioinformatics",
            preprint_server: "bioRxiv",
            country_name: "United States"
          }
        ],
        total: 344843,
        page: 1,
        page_size: 10,
        has_next: true
      }
    },
    {
      method: 'GET',
      endpoint: '/api/papers/search',
      description: 'Search papers by title, DOI, or author with pagination',
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'Search query (min 1 character)' },
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (max: 100)' }
      ],
      response: {
        papers: [
          {
            PPC_Id: "PPC_002",
            preprint_title: "COVID-19 Research Analysis",
            preprint_doi: "10.1101/2023.02.01.000002",
            total_citation: 89,
            all_authors: "Jane Smith, Bob Johnson"
          }
        ],
        total: 1247,
        page: 1,
        page_size: 10,
        has_next: true
      }
    },
    {
      method: 'GET',
      endpoint: '/api/papers/{ppc_id}',
      description: 'Get complete paper details by PPC_Id',
      parameters: [
        { name: 'ppc_id', type: 'string', required: true, description: 'Unique paper identifier' }
      ],
      response: {
        PPC_Id: "PPC_001",
        preprint_title: "Sample Research Paper",
        preprint_doi: "10.1101/2023.01.01.000001",
        preprint_subject: "bioinformatics",
        preprint_server: "bioRxiv",
        preprint_submission_date: "2023-01-01",
        preprint_abstract: "Abstract text...",
        all_authors: "John Doe, Jane Smith",
        submission_contact: "john.doe@university.edu",
        corresponding_institution: "University of Example",
        country_name: "United States",
        total_citation: 156,
        published_DOI: "10.1038/s41586-023-12345-6",
        versions: "[{\"version\": 1, \"date\": \"2023-01-01\"}]"
      }
    },
    {
      method: 'GET',
      endpoint: '/api/analytics/citations',
      description: 'Get unified citation data for all citation-related visualizations',
      parameters: [
        { name: 'time_range', type: 'string', required: false, description: 'Time filter: all, last_year, last_5_years, last_10_years' },
        { name: 'subject', type: 'string', required: false, description: 'Subject area filter' },
        { name: 'limit', type: 'integer', required: false, description: 'Limit for top papers (max: 100)' },
        { name: 'sort_by', type: 'string', required: false, description: 'Sort: citations_desc, citations_asc, date_desc, date_asc, title_asc' }
      ],
      response: {
        impactData: [
          {
            PPC_Id: "PPC_001",
            preprint_title: "High Impact Paper",
            publication_date: "2023-01-01",
            total_citation: 892,
            all_authors: "Jane Smith, Bob Johnson",
            preprint_subject: "molecular biology"
          }
        ],
        trendsData: [
          {
            year: "2023",
            citations: 15678,
            papers: 234
          }
        ],
        heatmapData: [
          {
            year: 2023,
            month: 6,
            day: 15,
            citations: 45
          }
        ],
        topPapersData: [],
        metadata: {
          time_range: "all",
          subject: null,
          limit: 10,
          sort_by: "citations_desc"
        }
      }
    },
    {
      method: 'GET',
      endpoint: '/api/analytics/dashboard',
      description: 'Get comprehensive analytics dashboard data',
      parameters: [],
      response: {
        timelineData: [
          {
            month: "2023-01",
            submissions: 1234
          }
        ],
        subjectData: [
          {
            subject: "neuroscience",
            count: 42923,
            percentage: 12.4
          }
        ],
        serverData: [
          {
            server: "bioRxiv",
            count: 239847,
            percentage: 69.6
          }
        ],
        statisticsData: {
          totalPapers: 344843,
          dateRange: {
            startDate: "2013-11-11",
            endDate: "2024-06-30"
          },
          mostActivePeriod: {
            period: "2020-04",
            count: 8945
          },
          averagePapersPerMonth: 2876,
          activeSubjects: 42,
          activeServers: 3
        }
      }
    },
    {
      method: 'GET',
      endpoint: '/api/analytics/subjects',
      description: 'Get all unique subject areas from the database',
      parameters: [],
      response: {
        data: [
          "neuroscience",
          "microbiology", 
          "bioinformatics",
          "cell biology",
          "genomics",
          "evolutionary biology"
        ]
      }
    },
    {
      method: 'GET',
      endpoint: '/api/authors/search',
      description: 'Search papers by author name using submission contact field',
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'Author name search query' },
        { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
        { name: 'page_size', type: 'integer', required: false, description: 'Items per page (max: 100)' }
      ],
      response: {
        papers: [
          {
            PPC_Id: "PPC_003",
            preprint_title: "Author's Research Paper",
            preprint_doi: "10.1101/2023.03.01.000003",
            submission_contact: "author@university.edu",
            total_citation: 67
          }
        ],
        total: 45,
        page: 1,
        page_size: 10,
        has_next: true
      }
    }
  ];

  const dataSources = [
    {
      name: 'bioRxiv',
      description: 'Biological sciences preprints - largest contributor to our database',
      url: 'https://www.biorxiv.org',
      coverage: '239,847',
      fields: ['Biology', 'Neuroscience', 'Bioinformatics', 'Cell Biology', 'Genomics'],
      color: '#27ae60'
    },
    {
      name: 'medRxiv',
      description: 'Medical and health sciences preprints with focus on clinical research',
      url: 'https://www.medrxiv.org',
      coverage: '55,695',
      fields: ['Medicine', 'Health Sciences', 'Public Health', 'Epidemiology', 'Clinical Research'],
      color: '#e74c3c'
    },
    {
      name: 'arXiv (q-bio)',
      description: 'Quantitative biology section of arXiv repository',
      url: 'https://arxiv.org/list/q-bio/recent',
      coverage: '49,301',
      fields: ['Quantitative Biology', 'Biophysics', 'Computational Biology', 'Systems Biology'],
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
                    <h3 className="text-heading-3">Research Foundation</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body">
                      Preprint Commons is the first dedicated database and analytical platform for large-scale preprint meta-analysis, 
                      built on rigorous academic research by Bibhu Prasad Behera and Binay Panda with institutional support from 
                      Jawaharlal Nehru University (JNU) and Centre for Development of Advanced Computing (C-DAC).
                    </p>
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                      <strong>Published Research:</strong> "Preprint Commons: A Database for Tracking Trends, Impact, and Collaboration in Open Science"
                    </div>
                  </Card.Content>
                </Card>

                <Card className={styles.overviewCard}>
                  <Card.Header>
                    <h3 className="text-heading-3">Technical Architecture</h3>
                  </Card.Header>
                  <Card.Content>
                    <ul className={styles.techList}>
                      <li>FastAPI backend with PostgreSQL database</li>
                      <li>React 19 frontend with Chart.js & D3.js</li>
                      <li>NVIDIA/Llama-3.1-Nemotron-70B-Instruct-HF for AI enhancement</li>
                      <li>High-performance computing with 8 A100-SXM4 GPUs</li>
                      <li>20+ RESTful API endpoints with automatic documentation</li>
                    </ul>
                  </Card.Content>
                </Card>

                <Card className={styles.overviewCard}>
                  <Card.Header>
                    <h3 className="text-heading-3">Database Statistics</h3>
                  </Card.Header>
                  <Card.Content>
                    <div className={styles.metrics}>
                      <div className={styles.metric}>
                        <span className={styles.metricNumber}>344,843</span>
                        <span className={styles.metricLabel}>Total Preprints</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricNumber}>3</span>
                        <span className={styles.metricLabel}>Major Repositories</span>
                      </div>
                      <div className={styles.metric}>
                        <span className={styles.metricNumber}>50+</span>
                        <span className={styles.metricLabel}>Countries</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      bioRxiv: 239,847 • medRxiv: 55,695 • arXiv (q-bio): 49,301
                    </div>
                  </Card.Content>
                </Card>
              </div>

              {/* Research Methodology Overview */}
              <Card style={{ marginTop: 'var(--spacing-2xl)' }}>
                <Card.Header>
                  <h3 className="text-heading-3">Research Methodology Overview</h3>
                </Card.Header>
                <Card.Content>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: 'var(--spacing-lg)',
                    marginTop: 'var(--spacing-lg)'
                  }}>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                      <div style={{ 
                        fontSize: 'var(--font-size-3xl)', 
                        marginBottom: 'var(--spacing-md)',
                        color: 'var(--color-primary)'
                      }}>📊</div>
                      <h4 className="text-heading-4">Data Acquisition</h4>
                      <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        Systematic pipeline gathering metadata from bioRxiv, medRxiv, and arXiv q-bio via dedicated APIs
                      </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                      <div style={{ 
                        fontSize: 'var(--font-size-3xl)', 
                        marginBottom: 'var(--spacing-md)',
                        color: 'var(--color-secondary)'
                      }}>🤖</div>
                      <h4 className="text-heading-4">AI Enhancement</h4>
                      <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        NVIDIA Nemotron-70B model deployed across 8 A100 GPUs for metadata extraction and geographic classification
                      </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                      <div style={{ 
                        fontSize: 'var(--font-size-3xl)', 
                        marginBottom: 'var(--spacing-md)',
                        color: 'var(--color-accent)'
                      }}>✅</div>
                      <h4 className="text-heading-4">Quality Control</h4>
                      <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        Random sampling validation with 85-90% accuracy rate and transparent reporting of limitations
                      </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                      <div style={{ 
                        fontSize: 'var(--font-size-3xl)', 
                        marginBottom: 'var(--spacing-md)',
                        color: 'var(--color-success)'
                      }}>🌐</div>
                      <h4 className="text-heading-4">Open Access</h4>
                      <p className="text-body-small" style={{ color: 'var(--color-text-secondary)' }}>
                        Full dataset available via REST API and bulk download, supporting reproducible research
                      </p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
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
                  <DataSourceCard 
                    key={index} 
                    {...source}
                    apiIntegration={true}
                    qualityScore="High"
                    updateFrequency="Real-time via API"
                    dataPoints={[
                      'DOI and metadata',
                      'Author affiliations', 
                      'Citation networks',
                      'Version histories',
                      'Subject classifications'
                    ]}
                  />
                ))}
              </div>

              <Card className={styles.dataProcessing}>
                <Card.Header>
                  <h3 className="text-heading-3">Advanced Data Processing Pipeline</h3>
                </Card.Header>
                <Card.Content>
                  <div className={styles.processingSteps}>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>1</div>
                      <div className={styles.stepContent}>
                        <h4>Systematic Data Acquisition</h4>
                        <p>Programmatic retrieval via dedicated APIs from bioRxiv (239,847), medRxiv (55,695), and arXiv q-bio (49,301) ensuring comprehensive coverage</p>
                      </div>
                    </div>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>2</div>
                      <div className={styles.stepContent}>
                        <h4>LLM-Powered Enhancement</h4>
                        <p>NVIDIA/Llama-3.1-Nemotron-70B-Instruct-HF model deployed on 8 A100-SXM4 GPUs for geographic and institutional metadata extraction</p>
                      </div>
                    </div>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>3</div>
                      <div className={styles.stepContent}>
                        <h4>Multi-Stage Preprocessing</h4>
                        <p>Duplicate removal, format harmonization, version tracking, and citation network integration via OpenCitations API</p>
                      </div>
                    </div>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>4</div>
                      <div className={styles.stepContent}>
                        <h4>Optimized Database Storage</h4>
                        <p>Normalized PostgreSQL schema with structured JSON for version histories and optimized indexing for analytical queries</p>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    marginTop: 'var(--spacing-2xl)', 
                    padding: 'var(--spacing-xl)', 
                    background: 'var(--color-bg-secondary)', 
                    borderRadius: 'var(--radius-lg)' 
                  }}>
                    <h4 className="text-heading-4" style={{ marginBottom: 'var(--spacing-md)' }}>
                      Technical Specifications
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: 'var(--spacing-lg)' 
                    }}>
                      <div>
                        <strong>Computing Infrastructure:</strong><br />
                        8 A100-SXM4 GPUs<br />
                        256 CPU cores per job<br />
                        24-hour maximum runtime
                      </div>
                      <div>
                        <strong>LLM Processing:</strong><br />
                        3,000 token chunks<br />
                        10% overlap between chunks<br />
                        Structured JSON output format
                      </div>
                      <div>
                        <strong>Quality Metrics:</strong><br />
                        85-90% accuracy rate<br />
                        10-15% error rate (known)<br />
                        Random sampling validation
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
                    <h3 className="text-heading-3">LLM-Based Enhancement Process</h3>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body mb-4">
                      Advanced NVIDIA/Llama-3.1-Nemotron-70B-Instruct-HF model processes preprint text to extract 
                      missing geographic and institutional metadata with structured JSON output format.
                    </p>
                    <div className={styles.aiProcess}>
                      <div className={styles.aiStep}>
                        <h4>Tiered Extraction Strategy</h4>
                        <p>JATS XML parsing followed by LLM analysis for missing affiliations, with chunking mechanism for longer texts</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Geographic Classification</h4>
                        <p>Country extraction from raw affiliation strings using structured prompts and error handling for malformed outputs</p>
                      </div>
                      <div className={styles.aiStep}>
                        <h4>Citation Network Integration</h4>
                        <p>OpenCitations API integration for comprehensive citation metadata and network analysis capabilities</p>
                      </div>
                    </div>
                    
                    <div style={{ 
                      marginTop: 'var(--spacing-lg)', 
                      padding: 'var(--spacing-md)', 
                      background: 'var(--color-warning)', 
                      color: 'white', 
                      borderRadius: 'var(--radius-md)' 
                    }}>
                      <strong>Known Limitation:</strong> LLM processing limited to first two pages due to computational constraints, 
                      which may result in missing affiliations located beyond this range.
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <h3 className="text-heading-3">Validated Quality Metrics</h3>
                  </Card.Header>
                  <Card.Content>
                    <div className={styles.qualityMetrics}>
                      <div className={styles.qualityMetric}>
                        <span className={styles.qualityNumber}>85-90%</span>
                        <span className={styles.qualityLabel}>Overall data accuracy</span>
                      </div>
                      <div className={styles.qualityMetric}>
                        <span className={styles.qualityNumber}>10-15%</span>
                        <span className={styles.qualityLabel}>Error rate (transparent reporting)</span>
                      </div>
                      <div className={styles.qualityMetric}>
                        <span className={styles.qualityNumber}>344,843</span>
                        <span className={styles.qualityLabel}>Total validated records</span>
                      </div>
                    </div>
                    <p className="text-body-small" style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
                      Quality control conducted through random sampling approach due to computational feasibility constraints. 
                      Primary error sources include LLM hallucination and input truncation limitations.
                    </p>
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

export default DocumentationPage;